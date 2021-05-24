window.onload = function(){
  let i = 0;
  let txt = 'Felicidades Marinichi!!!'; 
  let speed = 80; 
    typeWriter()
    

    window.addEventListener('mousemove', function(e) {
        var xPos = e.pageX;
        var yPos = e.pageY;

        if(xPos>1200)xPos = 1200;
        let leftPupil = document.getElementById('leftPupil');
        let rightPupil = document.getElementById('rightPupil');
        let top  = (yPos/10) - 46+'px';
        let left = (xPos/10) - 56+'px';

        leftPupil.style.top = top
        leftPupil.style.left= left
        rightPupil.style.top = top
        rightPupil.style.left= left

      });
    
     setTimeout(()=>{
          document.getElementById('leftEyebrow').style.display = 'inline';
          document.getElementById('rightEyebrow').style.display = 'inline';
          //document.getElementById('fire').style.visibility = 'visible';
          document.getElementById('leftEyeIris').style.backgroundImage='radial-gradient(rgb(255,80,0) 20%, rgba(255,80,0,0) 100%)';
          document.getElementById('rightEyeIris').style.backgroundImage='radial-gradient(rgb(255,80,0) 20%, rgba(255,80,0,0) 100%)';
        },2000)
    


        
        function typeWriter() {
 
          if (i < txt.length) {
            console.log('entra')
            document.getElementById("type").innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
          }
        }

    }
