onmessage = function(e) {
  // console.log('Worker: Message received from main script');
  const result = e.data     
    // console.log('Worker: Posting message back to main script');
    postMessage(result);  
}
