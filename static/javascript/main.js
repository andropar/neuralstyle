var slideIndex = 1;

var currentStyle = '';

showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  //var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  /*for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }*/
  slides[slideIndex-1].style.display = "block";
  //dots[slideIndex-1].className += " active";

  var currentSlideChildNodes = slides[slideIndex-1].childNodes;
  for (i = 0; i < currentSlideChildNodes.length; i++) {
      var node = currentSlideChildNodes[i];
      if (node.className == 'text') {
        currentStyle = node.innerHTML;
        console.log(currentStyle)
      }
  }
} 

function setContentImage(event) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById('ct-img').style.backgroundImage = "url("+e.target.result+")";
        }

        reader.readAsDataURL(event.target.files[0])
    } else {
        console.log(event)
    }
}

function doStyleTransfer() {
    const input = document.getElementById('file-upload');

    console.log(input)

    var data = new FormData();
    data.append('img', input.files[0]);
    data.append('style', currentStyle);

    fetch('http://localhost:5000/stylize_image', {
        method: 'POST',
        body: data
    }).then(res => {
        return res.json();
    }).then(data => {
        //document.getElementById('res-img').setAttribute('src', 'http://localhost:5000/'+data['output_url']);
        document.getElementById('res-img').style.backgroundImage = "url("+'http://localhost:5000/'+data['output_url']+")";
        //document.getElementById('load').style.display = 'none';
        //document.getElementById('res-img').style.display = 'flex';
    }).catch(err => {
        console.log('error');
    });

    //document.getElementById('result').style.display = 'flex';
}

var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
			fileName = e.target.value.split( '\\' ).pop();

		if( fileName )
			label.querySelector( 'span' ).innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});