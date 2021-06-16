(function () {
    "use strict";

    var desvg = function (selector, removeInlineCss, removeStyleElements) {
        removeInlineCss = removeInlineCss || false;
        removeStyleElements = removeStyleElements || false;

        var images,
            imagesLength,
            sortImages = {},

            // load svg file
            loadSvg = function (imgURL, replaceImages) {
                // set up the AJAX request
                var xhr = new XMLHttpRequest();
                xhr.open('GET', imgURL, true);

                xhr.onload = function () {
                    var xml,
                        svg,
                        paths,
                        replaceImagesLength,
                        styleElements;

                    // get the response in XML format
                    xml = xhr.responseXML;
                    replaceImagesLength = replaceImages.length;

                    // bail if no XML
                    if (!xml) {
                        return;
                    }

                    // this will be the <svg />
                    svg = xml.documentElement;

                    // remove not essentials
                    svg.removeAttribute('xmlns:a');
                    svg.removeAttribute('enable-background');

                    // set preserveAspectRatio
                    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                    // get all the SVG paths
                    paths = svg.querySelectorAll('path');

                    if (removeInlineCss) {
                        // if `removeInlineCss` is true then remove the style attributes from the SVG paths
                        for (var i = 0; i < paths.length; i++) {
                            paths[i].removeAttribute('style');
                        }
                    }

                    // ADD! -- remove included style tag

                    styleElements = svg.querySelectorAll('style')

                    if (removeStyleElements) {
                        // if `removeInlineCss` is true then remove the style attributes from the SVG paths
                        for (var i = 0; i < styleElements.length; i++) {
                            try {
                                styleElements[i].remove();
                            } catch (e) {
                                styleElements[i].parentNode.removeChild(styleElements[i]);
                            }
                        }
                    }

                    while (replaceImagesLength--) {
                        replaceImgWithSvg(replaceImages[replaceImagesLength], svg.cloneNode(true));
                    }
                };

                xhr.send();
            },

            // replace the original <img /> with the new <svg />
            replaceImgWithSvg = function (img, svg) {
                var imgID = img.id,
                    imgClasses = img.getAttribute('class');

                if (imgID) {
                    // re-assign the ID attribute from the <img />
                    svg.id = imgID;
                }

                if (imgClasses) {
                    // re-assign the class attribute from the <img />
                    svg.setAttribute('class', imgClasses + ' replaced-svg');
                }

                img.parentNode.replaceChild(svg, img);
            };



        // grab all the elements from the document matching the passed in selector
        images = document.querySelectorAll(selector);
        imagesLength = images.length;

        // sort images array by image url
        while (imagesLength--) {
            var _img = images[imagesLength],
                _imgURL;

            if (_img.getAttribute('data-src')) {
                _imgURL = _img.getAttribute('data-src')
            } else {
                _imgURL = _img.getAttribute('src')
            }

            if (sortImages[_imgURL]) {
                sortImages[_imgURL].push(_img);
            } else {
                sortImages[_imgURL] = [_img];
            }
        }

        // loops over the matched urls
        for (var key in sortImages) {
            if (key) {
                if (sortImages.hasOwnProperty(key)) {
                    loadSvg(key, sortImages[key]);
                }
            }
        }

    };

    window.deSVG = desvg;
})();

