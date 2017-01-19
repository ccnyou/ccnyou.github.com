defineClass('ChatMessageViewController', {
    _getIconHeight_width: function(linksDictionary, width) {
        var iconHeight = 0;
        var imageHeight = linksDictionary.yoyo_integerForKey("h");
        var imageWeight = linksDictionary.yoyo_integerForKey("w");
        if (imageWeight) {
            iconHeight = imageHeight / imageWeight * width;
        }
        return iconHeight;
    },
});