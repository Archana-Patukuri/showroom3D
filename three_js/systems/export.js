import axios from 'axios';
import { GLTFExporter } from '../../node_modules/three/examples/jsm/exporters/GLTFExporter.js';

function exportScene(scene) {
    const params = {
        trs: true,
        binary: true,
        maxTextureSize: 4096,
    };
    // Define the Flask server URL
    const flaskURL = 'https://viscommerce-cloud.com'; // Replace with your Flask server URL
    const exportButton = document.getElementById("Export_Image");
    const exportButton1 = document.getElementById("Export_Video");    
    let snackbarP=document.getElementById("snackbarP")
    let snackbarP1=document.getElementById("snackbarP1")
    let Image_1K = document.getElementById("Image_1K");
    let Image_2K = document.getElementById("Image_2K");
    let Image_4K = document.getElementById("Image_4K");
    localStorage.Image_text = 1.5;
    Image_1K.addEventListener("click", function (e) {
        if (e.target.checked) {
            console.log("1K checkbox clicked");
            localStorage.Image_text = 1.5;
        }
    });
    Image_2K.addEventListener("click", function (e) {
        if (e.target.checked) {
            console.log("2K checkbox clicked");
            localStorage.Image_text = 2.0;
        }
    });
    Image_4K.addEventListener("click", function (e) {
        if (e.target.checked) {
            console.log("4K checkbox clicked");
            localStorage.Image_text = 3.0;
        }
    });
    //exportJSON
    /* let exportJSON=document.getElementById("ExportJSON")
    exportJSON.addEventListener("click",function(e){
        exportGLTF(scene);
        function exportGLTF( input ) {
            const exporter = new GLTFExporter();
            const options = {
             trs: params.trs,
             binary: params.binary,
             maxTextureSize: params.maxTextureSize
           };
            exporter.parse(
             input,
             function ( result ) {                     
                 const output = JSON.stringify( result, null, 2 );         
                 saveString( output, 'office_Room.json' );                                   
             },        
             function ( error ) {       
               console.log( 'An error happened' );       
             },options
             
           );
        }     
        const link = document.createElement( 'a' );
           link.style.display = 'none';
           document.body.appendChild( link ); 
     
       function save( blob, filename ) {     
             link.href = URL.createObjectURL( blob );
             link.download = filename;
             link.click();     
       }
       function saveString( text, filename ) {     
         save( new Blob( [ text ], { type: 'text/plain' } ), filename );     
       }
           
    }) */
    //Export    
    let exportBtn=document.getElementById("Export")
    exportBtn.addEventListener("click",function(e){
        exportGLTF(scene);
        function exportGLTF( input ) {
            const exporter = new GLTFExporter();
            const options = {
             trs: params.trs,
             binary: params.binary,
             maxTextureSize: params.maxTextureSize
           };
            exporter.parse(
             input,
             function ( result ) {     
               if ( result instanceof ArrayBuffer ) {     
                 saveArrayBuffer( result, 'office_Room.glb' );                 
               }else {    
                 const output = JSON.stringify( result, null, 2 );         
                 saveString( output, 'office_Room.gltf' );     
               }               
             },        
             function ( error ) {       
               console.log( 'An error happened' );       
             },options
             
           );
        }     
        const link = document.createElement( 'a' );
           link.style.display = 'none';
           document.body.appendChild( link ); 
     
       function save( blob, filename ) {     
             link.href = URL.createObjectURL( blob );
             link.download = filename;
             link.click();     
       }
       function saveString( text, filename ) {     
         save( new Blob( [ text ], { type: 'text/plain' } ), filename );     
       }
     
       function saveArrayBuffer( buffer, filename ) {     
         save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );     
       } 
    })
    // Render Image
    exportButton.addEventListener("click", function () {
        const emailInput = document.getElementById("exampleInputEmail1");
        const email = emailInput.value.trim();
        if (email === "") {
            console.log("Email is required");
            return;
        } 
        // Export the scene with the provided email
        exportSceneFun_Image(scene, email);        
        snackbarP.style.display="block"
        setTimeout(function () {
            snackbarP.style.display="none"
        }, 5000); 
    });
    // Render Video
    exportButton1.addEventListener("click", function () {
        const emailInput = document.getElementById("exampleInputEmail1");
        const email = emailInput.value.trim();
        if (email === "") {
            console.log("Email is required");
            return;
        }
        // Export the scene with the provided email
        exportSceneFun_Video(scene, email);
        alert("Photo-realistic image rendered in VisCommerce 3DCloud will be delivered to your email-inbox  shortly");
    });
    function exportSceneFun_Image(scene, email) {
        const exporter = new GLTFExporter();
        const options = {
            trs: params.trs,
            binary: params.binary,
            maxTextureSize: params.maxTextureSize,
        };
        exporter.parse(scene, function (result) {
            if (result instanceof ArrayBuffer) {
                const fileName = `${email}.glb`; // Use email as the file name
                // Convert the ArrayBuffer to a Blob
                const glbBlob = new Blob([result], { type: 'model/gltf-binary' });
                // Create a FormData object to send the file to the server
                const formData = new FormData();
                formData.append('email', email);
                formData.append('glbData', glbBlob, fileName);
                // Send the GLB data to the server using Axios
                axios.post(`${flaskURL}/image_render`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        email: email,
                        image_text: parseFloat(localStorage.Image_text), // Convert to float and include as a query parameter
                    },
                })
                    .then(function (response) {
                        console.log(response.data);
                        console.log(response.config);
                        snackbarP1.style.display="block"
                        setTimeout(function () {
                            snackbarP1.style.display="none"
                        }, 5000);                                    
                    })
                    .catch(function (error) {
                        console.log("An error happened while uploading GLB");
                        console.error(error);
                    });
            } else {
                // Handle if the result is not an ArrayBuffer (JSON format)
                console.log("JSON format not supported for upload");
            }
        }, function (error) {
            console.log("An error happened during GLTF export");
        }, options);
        return 1;
    }
    function exportSceneFun_Video(scene, email) {
        const exporter = new GLTFExporter();
        const options = {
            trs: params.trs,
            binary: params.binary,
            maxTextureSize: params.maxTextureSize,
        };
        exporter.parse(scene, function (result) {
            if (result instanceof ArrayBuffer) {
                const fileName = `${email}.glb`; // Use email as the file name
                // Convert the ArrayBuffer to a Blob
                const glbBlob = new Blob([result], { type: 'model/gltf-binary' });
                // Create a FormData object to send the file to the server
                const formData = new FormData();
                formData.append('email', email);
                formData.append('glbData', glbBlob, fileName);
                // Send the GLB data to the server using Axios
                axios.post(`${flaskURL}/video_render`, formData)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log("An error happened while uploading GLB");
                        console.error(error);
                    });
            } else {
                // Handle if the result is not an ArrayBuffer (JSON format)
                console.log("JSON format not supported for upload");
            }
        }, function (error) {
            console.log("An error happened during GLTF export");
        }, options);
        return 1;
    }
}

export { exportScene };
