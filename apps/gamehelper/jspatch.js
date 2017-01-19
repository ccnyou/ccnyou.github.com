defineClass('ChatMessageViewController', {
    _getIconHeight_width: function(linksDictionary, width) {

        var imageHeight = linksDictionary.yoyo_integerForKey("h");
        var imageWeight = linksDictionary.yoyo_integerForKey("w");
        if (imageWeight) {
            var iconHeight = imageHeight / imageWeight * width;
        }
        return iconHeight;
    },
});