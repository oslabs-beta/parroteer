/**
 * Prompts the user to save a provided string of text under the given (suggested) file name
 * @param type The mimetype of the file, e.g. `text/javascript`. Default 'javascript'
 */
export default function exportToFile(text: string, filename: string, type = 'javascript') {
  chrome.downloads.download({
    filename: filename,
    url: `data:text/${type};charset=utf-8,${encodeURIComponent(text)}`,
    saveAs: true
  });
}