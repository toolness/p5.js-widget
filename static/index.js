$(function() {
  var FORCE_HTTPS = true;
  var widgetURL = p5Widget.url;
  var simplifyHtml = function(html) {
    // This will convert e.g. data-autoplay="", which is how browsers
    // will always serialize the HTML, to just data-autoplay, which
    // reads better.
    return html.replace(/=""/g, '');
  };

  if (FORCE_HTTPS) {
    widgetURL = widgetURL.replace('http:', 'https:');
  }

  $("#script-tag-example").text('<script src="' + widgetURL + '"></script>');

  $("#default-height").text(p5Widget.defaults.HEIGHT);

  $('script[type="text/p5"]').each(function() {
    if (this.hasAttribute('data-hide-sourcecode')) return;

    var div = $('<div></div>');
    var code = $('<code class="language-markup"></code>');

    $(this).clone().appendTo(div);

    code.text(simplifyHtml(div.html()));

    $(this).before(code);

    code.wrap('<pre></pre>');
  });

  Prism.highlightAll();
  p5Widget.replaceAll();
});
