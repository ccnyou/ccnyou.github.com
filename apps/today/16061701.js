require('UIView, UIColor, UILabel')
defineClass('ViewController', {
  // replace the -genView method
  _testJsPatch: function() {
  	self.view.makeToast("JsPatchToast");
  }
});
