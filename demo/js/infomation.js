function onExpandClicked(e) {
    e.preventDefault();
    var ele = arale.node(e.currentTarget);

    if (ele.attr('class') !== 'donate-detail-toggleImage') {
        ele = ele.parents('li');
        ele = ele[0];
        ele = ele.nodes('.donate-detail-toggleImage-wrapper');
        ele = ele[0]
        ele = ele.nodes('.donate-detail-toggleImage');
        ele = ele[0];
    }

    var li = ele.parent().parent();
    var largeImageWrapper = li.nodes('.donate-detail-img-large')[0];
    var smallImageWrapper = li.nodes('.donate-detail-img-small')[0];

    var largeTextWrapper = li.nodes('.donate-detail-text-large')[0];
    var smallTextWrapper = li.nodes('.donate-detail-text-small')[0];

    if (ele.hasClass('expanded')) {
        largeImageWrapper.hide();
        smallImageWrapper.show();
        largeTextWrapper.hide();
        smallTextWrapper.show();
        ele.removeClass('expanded');
        ele.setHtml('展开详情');
        ele.attr('seed', 'gy-expand-whereabouts-detail');
        location.hash = "anchor-application";
        if (document.getElementById('J-pager')) {
            document.getElementById('J-pager').innerHTML = document.getElementById('J-pager').innerHTML;
            bindPageEvent();
        }
    } else {
        var inputs = largeImageWrapper.nodes('input');
        var images = [];
        for (var i = 0; i < inputs.length; i++) {
            var src = inputs[i].attr('value');
            inputs[i].dispose();
            var img = D.toDom('<img src="' + src + '" alt="善款去向" />');
            images.push(img);
            largeImageWrapper.adopt(img);
            E.connect(img, 'onload', function (e) {
                if (e.currentTarget.width > 600) e.currentTarget.width = 600;
            });
        }
        largeImageWrapper.show();
        smallImageWrapper.hide();
        largeTextWrapper.show();
        smallTextWrapper.hide();
        ele.addClass('expanded');
        ele.setHtml('收起详情');
        ele.attr('seed', 'gy-close-whereabouts-detail');
        if (document.getElementById('J-pager')) {
            if (images[i - 1]) {
                E.connect(images[i - 1], 'load', function () {
                    document.getElementById('J-pager').innerHTML = document.getElementById('J-pager').innerHTML;
                    bindPageEvent();

                });
            } else {
                document.getElementById('J-pager').innerHTML = document.getElementById('J-pager').innerHTML;
                bindPageEvent();
            }
        }
    }
    e.preventDefault();
}

jQuery(document).ready(function () {
    console.log("ready!");
    if ($$('.donate-detail-toggleImage').length) {
        E.connect($$('.donate-detail-toggleImage'), 'onclick', onExpandClicked);
    }
    if ($$('.donate-detail-img-small a').length) {
        E.connect($$('.donate-detail-img-small a'), 'onclick', onExpandClicked);
    }
});