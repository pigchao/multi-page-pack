import { isArray, isFunction, isPlainObject } from "../../isomorphism/fun";

const resLoaderObj = {
  total: 0,
  start(options) {
    const imageArr = options.resources;
    this.total = options.resources.length;
    if (isFunction(options.onStart)) {
      options.onStart(this.total);
    }
    Promise.all(this._PromiseArray(imageArr, options.onProgress))
      .then(result => {
        if (isFunction(options.onComplete)) {
          options.onComplete(this.total, result);
        }
      })
      .catch(err => console.log(err));
  },
  _PromiseArray(imageArr, callback) {
    const promiseArr = [];
    let currentIndex = 0;
    for (const img of imageArr) {
      const promise = this._loadImage(img);
      promiseArr.push(promise);
      promise
        .then(data => {
          currentIndex++;
          if (isFunction(callback)) {
            callback(currentIndex, this.total);
          }
        })
        .catch(err => console.log(err));
    }
    return promiseArr;
  },
  _loadImage(imageData) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(imageData);
      };
      image.src = isPlainObject(imageData) ? imageData.url : imageData;
      image.onerror = () => {
        reject(imageData);
      };
    });
  }
};

export const resLoader = options => {
  if (!isPlainObject(options)) {
    throw new TypeError("Expected an object");
  } else {
    if (!isArray(options.resources)) {
      throw new TypeError("options.resources Expected an Array or JSON");
    } else {
      resLoaderObj.start(options);
    }
  }
};
