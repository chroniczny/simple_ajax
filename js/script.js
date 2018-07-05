
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();

    var address = streetStr + ', ' + cityStr;

    var addressNonSpace = address.replace(/ /gi, "_");
    $greeting.text('So you wanna live in ' + address + '?');
    var streetUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + addressNonSpace;
    var toAppend = '<img class="bgimg" src="'+streetUrl+'">';
    $body.append(toAppend);

    var nyTimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+ cityStr +'&sort=newest&api-key=7d90cceb5e914401a07d5ee1335d403b';

    $.getJSON(nyTimesUrl, function(data){
        console.log(data.copyright);

        $nytHeaderElem.text('NYTimes Articles about ' + cityStr);

        articles = data.response.docs;
        articles.forEach(function(article) {
            $nytElem.append(
                '<li class="article">' +
                    '<a href="'+ article.web_url+'">'+
                        article.headline.main +'</a>'+
                    '<p>'+article.snippet+'</p>'+
                 '</li>'
                )
        })
    }).error(function(e) {
        $nytHeaderElem.text('NYTimes Articles about your city can not be loaded due to SOME ERROR!!!');
        }

    );

    var wikiRequestTimeout = setTimeout(function(){ // because theres no "fail" in ajax jsonp request
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    var wikiUrl = 'http://en.wikipediaZXZX.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback", // to change callback name from url above

        success: function(response) {
            var articleList = response[1];

            articleList.forEach(function(articleStr) {
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;

                $wikiElem.append('<li><a href="' + url + '">'+ articleStr +'</a></li>');
            });

            clearTimeout(wikiRequestTimeout); // success - stop timeout
        }
    });

    return false;
}

$('#form-container').submit(loadData);
