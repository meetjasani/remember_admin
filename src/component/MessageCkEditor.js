import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { API } from "../config/API/api.config";

const MessageCkEditor = (props) => {
  const [wordCount, setWordCount] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  let IFRAME_SRC = '//cdn.iframe.ly/api/iframe';
  let API_KEY = '13c9bd8f21b29e738b1645';
  const handleChange = (event, editor) => {
    const data = editor.getData();
    var regex = /\s+/gi;
    const strippedString = data.replace(/(<([^>]+)>)/gi, "");
    var wordCount = strippedString.trim().replace(regex, " ").split(" ").length;
    var totalChars = strippedString.length;
    setWordCount(wordCount);
    setTotalChars(totalChars);
    props.onChange(data);
  };

  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={props.data}
        onChange={handleChange}
        languages={{ id: "ko", label: "korean" }}
        // getAllMemorialHallMessage={props.getAllMemorialHallMessage}
        config={{
          language: { ui: "ko", content: "korean" },
          mediaEmbed: {

            // Previews are always enabled if there’s a provider for a URL (below regex catches all URLs)
            // By default `previewsInData` are disabled, but let’s set it to `false` explicitely to be sure
            previewsInData: true,

            providers: [
              {
                // hint: this is just for previews. Get actual HTML codes by making API calls from your CMS
                name: 'iframely previews',

                // Match all URLs or just the ones you need:
                url: /.+/,

                html: match => {
                  const url = match[0];

                  var iframeUrl = IFRAME_SRC + '?app=1 & omit_script=1&omit_css=true&api_key=' + API_KEY + '&url=' + encodeURIComponent(url);

                  return (
                    // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                    '<div class="iframely-embed">' +
                    '<div class="iframely-responsive">' +
                    `<iframe src="${iframeUrl}" ` +
                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                    '</iframe>' +
                    '</div>' +
                    '</div>'
                  );
                }
              }
            ]
          },
          ckfinder: {
            uploadUrl: `${API.endpoint}/memorialHall/memorialHallMessageImage?id=$lang=ko`,
            // Enable the XMLHttpRequest.withCredentials property.
            withCredentials: true,
            // Headers sent along with the XMLHttpRequest to the upload server.
            headers: {
              "X-CSRF-TOKEN": "CSFR-Token",
              Authorization: "Bearer <JSON Web Token>",
            },
          },
        }}
      />
      <div className="word-counter">
        <p className="mx-2">Words: {wordCount}</p>
        <p>Characters: {totalChars}</p>
      </div>
    </>
  );
};

export default MessageCkEditor;
