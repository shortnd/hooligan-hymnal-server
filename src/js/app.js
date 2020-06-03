import dropzone from './modules/dropzone';
import SortList from './modules/sortable';

import Dropzone from "dropzone";

import 'alpinejs';

SortList();

const isAdvancedUpload = () => {
  var div = document.createElement('div');
  return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FileReader' in window
}

if (isAdvancedUpload) {
  const playerThumbnailUploader = document.getElementById('thumbnail-upload-section');
  const playerThumbnailInput = document.querySelector('input[name="thumbnail"]');
  const playerImagesUploader = document.getElementById('images-upload-section');
  const playerImagesInput = document.querySelector('input[name="images"]');

  ['drag', 'dragstart', 'dragend', 'dragover', 'dragleave', 'drop'].forEach( function ( event )
  {
    // Thumbnail
    playerThumbnailUploader.addEventListener( event, function ( e )
    {
      e.preventDefault();
      e.stopPropagation();
    } );
    // Images
    playerImagesUploader.addEventListener( event, function (e)
    {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  [ 'dragover', 'dragenter' ].forEach( function( event )
  {
    // Thumbnail
    playerThumbnailUploader.addEventListener( event, function ()
    {
      playerThumbnailUploader.classList.add( 'is-dragover' );
    });
    // Images
    playerImagesUploader.addEventListener( event, function() {
      playerImagesUploader.classList.add( 'is-dragover' );
    });
  });
  [ 'dragleave', 'dragend', 'drop', ].forEach(function(event)
    {
      // Thumbnail
      playerThumbnailUploader.addEventListener(event, function()
      {
        playerThumbnailUploader.classList.remove('is-dragover');
      });
      // Images
      playerImagesUploader.addEventListener(event, function() {
        playerImagesUploader.classList.remove('is-dragover');
      })
  });
  // Thumbnail Start
  playerThumbnailInput.classList.add('hidden');
  const thumbnailInputChangeEvent = () => playerThumbnailInput.dispatchEvent(new Event('change'));
  playerThumbnailUploader.addEventListener('drop', function(e) {
    if (e.dataTransfer.files.length > 1) {
      alert('Please only upload one image');
      return;
    }

    playerThumbnailInput.files = e.dataTransfer.files;
    thumbnailInputChangeEvent();
  });

  playerThumbnailUploader.addEventListener('click', function() {
    playerThumbnailInput.click();
  });

  playerThumbnailInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      const fileName = this.files[0].name;
      reader.onload = function () {
      let thumbTemp = document.getElementById('thumbnail-template').cloneNode(true);
      thumbTemp.querySelector('img').setAttribute('src', reader.result);
      thumbTemp.querySelector('p').innerText = fileName;
      thumbTemp.classList.remove('hidden');
      thumbTemp.querySelector('.thumbnail-close').addEventListener('click', function(e) {
        // debugger;
        e.preventDefault();
        playerThumbnailInput.value = "";
        document.getElementById('thumbnail-previews').innerHTML = "";
      });
      document.getElementById('thumbnail-previews').appendChild(thumbTemp);
      };
      reader.readAsDataURL(this.files[0])
    }
  });
  // Thumbnail End
  // Images Start
  playerImagesInput.classList.add('hidden');
  playerImagesInput.remove();
  const playerInputChangeEvent = () => playerImagesInput.dispatchEvent(new Event('change'));
  playerImagesUploader.addEventListener('drop', function (e) {
    for(let i = 0; i < e.dataTransfer.files.length; i++) {
      let newImgInput = document.createElement('input')
      newImgInput.type = "file";
      newImgInput.accept = "image/*";
      newImgInput.name = "images";
      newImgInput.classList.add('hidden');
      const fileName = e.dataTransfer.files[i].name;
      const reader = new FileReader();
      reader.onload = function() {
        let tempImg = document.getElementById('images-template').cloneNode(true);
        tempImg.querySelector('img').setAttribute('src', reader.result);
        tempImg.querySelector('p').innerText = fileName;
        tempImg.classList.remove('hidden');
        tempImg.appendChild(newImgInput);
        tempImg.querySelector('.image-clear').addEventListener('click', function(e) {
          e.preventDefault();
          this.parentNode.parentNode.remove();
        });
        document.getElementById('images-previews').appendChild(tempImg);
      };
      reader.readAsDataURL(e.dataTransfer.files[i]);
    }
  });

  playerImagesUploader.addEventListener('click', function(e) {
    let newImgInput = document.createElement('input')
      newImgInput.type = "file";
      newImgInput.accept = "image/*";
      newImgInput.name = "images";
      newImgInput.classList.add('hidden');
      newImgInput.click();
      newImgInput.onchange = function() {
        if (this.files && this.files[0]) {
        // const fileName = e.dataTransfer.files[i].name;
        for (let i = 0; i < this.files.length; i++) {
          const reader = new FileReader();
          const fileName = this.files[i].name;
          reader.onload = function (e) {
              // debugger;
              // newImgInput.files = e.dataTransfer.files[i];
              let tempImg = document.getElementById('images-template').cloneNode(true);
              tempImg.querySelector('img').setAttribute('src', reader.result);
              tempImg.querySelector('p').innerText = fileName;
              tempImg.classList.remove('hidden');
              tempImg.appendChild(newImgInput);
              tempImg.querySelector('.image-clear').addEventListener('click', function(e) {
                e.preventDefault();
                this.parentNode.parentNode.remove();
              });
              document.getElementById('images-previews').appendChild(tempImg);
            };
            reader.readAsDataURL(this.files[i])
          }
        }
      };
    // playerImagesInput.click();
  });

  // playerImagesInput.addEventListener('change', function (e) {
  //   if (this.files && this.files[0]) {
  //     for(let i = 0; i < this.files.length; i++) {
  //       const reader = new FileReader();
  //       const fileName = this.files[i].name;
  //       reader.onload = function() {
  //         // console.log(reader.result)
  //         let tempImg = document.getElementById('images-template').cloneNode(true);
  //         tempImg.querySelector('img').setAttribute('src', reader.result);
  //         tempImg.querySelector('p').innerText = fileName;
  //         tempImg.classList.remove('hidden');
  //         document.getElementById('images-previews').appendChild(tempImg);
  //       }
  //       reader.readAsDataURL(this.files[i]);
  //     }
  //   }
  // });
  // Images End
}

// dropzone(
//   '/players/thumbnail',
//   'thumbnail-template',
//   document.getElementById('thumbnail-upload-section'),
//   '#thumbnail-previews',
//   '#thumbnail-target',
//   'Thumbnail',
//   1,
//   'thumbnail',
// );

// const myDropzone = new Dropzone(document.getElementById('thumbnail-upload-section'), {
//   url: '/',
//   autoQueue: false,
//   maxFiles: 1,
//   acceptedFiles: "images/*",
//   previewTemplate: document.getElementById('thumbnail-template').parentNode.innerHTML,
//   previewsContainer: '#thumbnail-previews',
//   clickable: false,
// });

// document.getElementById('thumbnail-upload-section').addEventListener('click', function() {
//   var input = document.querySelector('input[name="thumbnail"]');
//   input.click();
// });

// myDropzone.on('drop', (e) => {
//   debugger;
// })

// var thumbnailTarget = document.getElementById('thumbnail-upload-section');
// var thumbnailInput = document.querySelector('input[name="thumbnail"]');

// thumbnailTarget.addEventListener('dragover', (e) => {
//   e.preventDefault();
// })

// thumbnailTarget.appendChild('dragleave', (e) => {
//   e.preventDefault();
// })

// thumbnailTarget.addEventListener('drop', (e) => {
//   e.preventDefault();
//   e.stopPropagation();

//   thumbnailInput.files = e.dataTransfer.files;
//   debugger;
// })

// dropzone(
//   '/players/images',
//   'images-template',
//   document.getElementById('images-upload-section'),
//   '#images-previews',
//   '#images-target',
//   'Player Images',
//   10,
//   'images',
// );

// dropzone(
//   '/foes/logo',
//   'logo-template',
//   document.getElementById('logo-upload-section'),
//   '#logo-previews',
//   '#logo-target',
//   'Logo',
//   1,
//   'logo',
// );

// dropzone(
//   '/channels/avatar',
//   'avatar-template',
//   document.getElementById('avatar-upload-section'),
//   '#avatar-previews',
//   '#avatar-target',
//   'Avatar',
//   1,
//   'avatarUrl',
// );

// dropzone(
//   '/songbooks/front-cover',
//   'front_cover-template',
//   document.getElementById('front_cover-upload-section'),
//   '#front_cover-previews',
//   '#front_cover-target',
//   'front_cover',
//   1,
//   'front_cover',
// );

// dropzone(
//   '/songbooks/back-cover',
//   'back_cover-template',
//   document.getElementById('back_cover-upload-section'),
//   '#back_cover-previews',
//   '#back_cover-target',
//   'back_cover',
//   1,
//   'back_cover',
// );
