import { libflashrom } from '../libflashrom.mjs';

let api;
const mymod = libflashrom({
  locateFile: function (path, dir) {
    console.log('path ' + path + ' dir ' + dir);
    return dir + path;
  },
}).then(m => {
  delete m['then'];
  api = mymod.api;
  api.wasm_flashrom_lib_init();
  console.log('Flashrom version ' + api.flashrom_version_info() + ' loaded');
  Promise.resolve(m);
});

export const FLASHROM_CHIP_READ = 'FLASHROM_CHIP_READ';
export const FLASHROM_CHIP_WRITE = 'FLASHROM_CHIP_WRITE';
export const FLASHROM_CHIP_READ_FINISHED = 'FLASHROM_CHIP_READ_FINISHED';
export const FLASHROM_CHIP_WRITE_FINISHED = 'FLASHROM_CHIP_WRITE_FINISHED';
export const FLASHROM_CHIP_PROBING = 'FLASHROM_CHIP_PROBING';
export const FLASHROM_CHIP_FOUND = 'FLASHROM_CHIP_FOUND';

const flashromChipRead = () => {
  return {
    type: FLASHROM_CHIP_READ,
  };
};

const flashromChipReadFinished = () => {
  return {
    type: FLASHROM_CHIP_READ_FINISHED,
  };
};

const flashromChipWrite = () => {
  return {
    type: FLASHROM_CHIP_WRITE,
  };
};

const flashromChipWriteFinished = () => {
  return {
    type: FLASHROM_CHIP_WRITE_FINISHED,
  };
};

const flashromChipFound = (size, flashName) => {
  return {
    type: FLASHROM_CHIP_FOUND,
    size,
    flashName,
  };
};

export const readFlash = serialNumber => async dispatch => {
  dispatch(flashromChipRead());
  await mymod;
  const target = `target=ap,serial=${serialNumber}`;

  const p = await api.wasm_setup_programmer(target);
  const x = await api.wasm_probe_flash(p);
  const s = api.flashrom_flash_getsize(x);

  const vendor = api.flashrom_flash_getvendor(x);
  const name = vendor + ' ' + api.flashrom_flash_getname(x);
  dispatch(flashromChipFound(s, name));

  const buf = mymod._malloc(s);
  const ret = await api.flashrom_image_read(x, buf, s);
  console.log(ret);

  api.flashrom_flash_release(x);
  api.flashrom_programmer_shutdown(p);

  const resultView = new Uint8Array(mymod.HEAP8.buffer, buf, s);
  const result = new Uint8Array(resultView);
  const blob = new Blob([result], { type: 'application/binary' });
  mymod._free(buf);
  const blobURL = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = 'wasm-firmware.bin';
  link.click();
  dispatch(flashromChipReadFinished());
};

export const writeFlash = (serialNumber, fileSelector) => async dispatch => {
  dispatch(flashromChipWrite());
  const target = `target=ap,serial=${serialNumber}`;

  const p = await api.wasm_setup_programmer(target);
  const x = await api.wasm_probe_flash(p);
  const s = api.flashrom_flash_getsize(x);
  const vendor = api.flashrom_flash_getvendor(x);
  const name = vendor + ' ' + api.flashrom_flash_getname(x);
  dispatch(flashromChipFound(s, name));

  const data = await new Promise(function (resolve, reject) {
    fileSelector.addEventListener('change', event => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        const res = event.target.result;
        if (res.byteLength !== s) {
          reject(Error('Length does not match'));
        } else {
          resolve(new Uint8Array(event.target.result));
        }
      });
      /* TODO: Should handle cancel and errors gracefully */
      reader.addEventListener('error', e =>
        reject(Error('Something went wrong: ' + e))
      );
      reader.addEventListener('abort', e =>
        reject(Error('User canceled: ' + e))
      );

      reader.readAsArrayBuffer(file);
    });

    fileSelector.click();
  });

  const buf = mymod._malloc(s);
  console.log(data);
  mymod.HEAP8.set(data, buf);

  const ret = await api.flashrom_image_write(x, buf, s, 0);
  console.log(ret);

  api.flashrom_flash_release(x);
  api.flashrom_programmer_shutdown(p);

  mymod._free(buf);
  dispatch(flashromChipWriteFinished());
};
