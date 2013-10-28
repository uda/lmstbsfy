var search_engines = {
  "google" : {
    name : "Google",
    url : "https://www.google.com/#q=%s"
  },
  "bing" : {
    name : "Bing",
    url : "http://www.bing.com/search?q=%s"
  },
  "ask" : {
    name : "Ask",
    url : "http://www.ask.com/web?q=%s"
  },
  "ddg" : {
    name : "DuckDuckGo",
    url : "https://duckduckgo.com/?q=%s"
  },
  "yahoo" : {
    name : "Yahoo",
    url : "http://search.yahoo.com/search?p=%s"
  }
};

chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    updateDefaultSuggestion(text);

    is_selected = /^\[([^\]]+)\]:/.test(text);
    if (is_selected) {
      parts = /^\[([^\]]+)\]:(.*)$/.exec(text);
      text = parts[2];
    }

    results = [];
    for (i in search_engines) {
      if (i == 'google') continue;
      se = search_engines[i];
      results.push({
        content : "[" + i + "]:" + text,
        description : "<dim>Serach </dim><match>" + text + "</match><dim> on " + se.name + "</dim>"
      });
    }

    suggest(results);
  }
);

function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: "<match><url>bs</url></match> Search Bullshit"
  });
}

resetDefaultSuggestion();

function updateDefaultSuggestion(text) {
  var description = "<dim>Serach </dim><match>" + text + "</match><dim> on Google</dim>";
  chrome.omnibox.setDefaultSuggestion({
    description: description
  });
}

chrome.omnibox.onInputStarted.addListener(function() {
  updateDefaultSuggestion('');
});

chrome.omnibox.onInputCancelled.addListener(function() {
  resetDefaultSuggestion();
});

function navigate(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  });
}

chrome.omnibox.onInputEntered.addListener(function(text) {
  se_name = "google";
  is_selected = /^\[([^\]]+)\]:/.test(text);
  if (is_selected) {
    parts = /^\[([^\]]+)\]:(.*)$/.exec(text);
    se_name = parts[1];
    text = parts[2];
  }
  url = search_engines[se_name].url.replace("%s", "" + text + "%20AND%20(debunk%20OR%20fake%20OR%20hoax%20OR%20quack)");
  navigate(url);
});
