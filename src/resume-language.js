// Classic script (not a module) so the page also works from file:// when printing the PDF.
(function () {
  var params = new URLSearchParams(location.search);
  if (params.get('lang') === 'en') {
    document.documentElement.lang = 'en';
    document.title = 'Résumé — Leonardo Olivieri Szervinski';
  }
  if (params.get('embed')) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('embed');
    });
  }
})();
