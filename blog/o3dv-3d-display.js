window.addEventListener ('load', () => {
    // tell the engine where to find the libs folder
    OV.SetExternalLibLocation ('libs');
    // init all viewers on the page
    OV.Init3DViewerElements ();
});
