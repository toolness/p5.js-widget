$(function() {
  var FORCE_HTTPS = true;
  var widgetURL = p5Widget.url;

  if (FORCE_HTTPS) {
    widgetURL = widgetURL.replace('http:', 'https:');
  }

  $("#script-tag-example").text('<script src="' + widgetURL + '"></script>');

  $('script[type="text/p5"]').each(function() {
    if (this.hasAttribute('data-hide-sourcecode')) return;

    var div = $('<div></div>');
    var code = $('<code class="language-markup"></code>');

    $(this).clone().appendTo(div);

    code.text(div.html());

    $(this).before(code);

    code.wrap('<pre></pre>');
  });

  Prism.highlightAll();
  p5Widget.replaceAll();
});
