export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    console.info('Tracewright Recorder installed');
  });
});
