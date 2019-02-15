const url = "../docs/mongo.pdf";

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 2,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

const renderPage = num => {
  pageIsRendering = true;
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering - false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending - null;
      }
    });

    document.querySelector("#page-num").textContent = num;
  });
};

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;

  document.querySelector("#page-count").textContent = pdfDoc.numPages;

  renderPage(pageNum);
});
