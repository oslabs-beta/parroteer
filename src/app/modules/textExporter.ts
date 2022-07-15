export default function exportToFile(text: string, fileName: string, type = 'javascript') {
  chrome.downloads.download({
    filename: fileName,
    url: `data:text/${type};charset=utf-8,${encodeURIComponent(text)}`,
    saveAs: true
  });
}