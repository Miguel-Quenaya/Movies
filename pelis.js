//https://api.themoviedb.org/3/search/movie?api_key=5c0aaa9071b6434430476ee43c85f161&query=matrix&language=es
// buscar id del otro https://api.themoviedb.org/3/movie/591955/external_ids?api_key=5c0aaa9071b6434430476ee43c85f161
window.onload = main;

function main(){
    loading = document.getElementsByClassName('loading')[0];
    loading.style = 'display:none';
    document.getElementById('filmButton').addEventListener('click', buscarPelis, true);
    document.addEventListener('keyup', buscador, true);
}

function buscador(){
    var texto = document.getElementById('filmSearch').value;
    if(texto.length < 3){
        document.getElementById('suggestions').style = 'display:none'
        return;
    }
    var palabrasarray = texto.split(' ');
    var palabras = "&query=" + palabrasarray[0];
    for (let i = 1; i < palabrasarray.length; i++) {
        palabras += '+' + palabrasarray[i];
        
    }
    var url = 'https://api.themoviedb.org/3/search/movie';

        key = '?api_key=5c0aaa9071b6434430476ee43c85f161';
        $.ajax({
            type: 'GET',
            url: url + key + palabras + '&lenguage=es',
            async: false,
            global: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                
                arrayJson = json['results'];

                mostrarResultados(arrayJson);
                
            },
            error: function(e) {
                console.log(e.message);
            }
    });
}

function mostrarResultados(array){
    var inner = '';
    document.getElementById('suggestions').style = 'display:block'
    for (let i = 0; i < array.length; i++) {
        //<div class="suggest-element" id="624860">The Matrix Resurrections</div>
        inner += '<div class="suggest-element" id="' + array[i]['id'] + '">'+ array[i]['original_title']+ '</div>'       
    }
    document.getElementById('suggestions').innerHTML = inner;
    resultados = document.getElementsByClassName('suggest-element');

    for (let i = 0; i< resultados.length; i++) {
      resultados[i].addEventListener('click', redirectFilmPuente,true); 
    }
}

function redirectFilmPuente(){
    redirectFilm(this.id);
}

function redirectFilm(idPeli){
        $.ajax({
            type: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + idPeli + '/external_ids?api_key=5c0aaa9071b6434430476ee43c85f161',
            async: false,
            global: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                
                if(json["imdb_id"] != null){
                    window.open("https://www.imdb.com/title/" + json["imdb_id"] + "/?ref_=nv_sr_srsg_3", '_blank').focus();
                }
            },
            error: function(e) {
                console.log(e.message);
            }
    });   
}

function buscarPelis(){
    inner = '';
    for (let i = 0; i < arrayJson.length; i++) {
        detallesPeli(arrayJson[i]['id']);
        
    }
}

function detallesPeli(id){
   
        $.ajax({
            type: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + id + '?api_key=5c0aaa9071b6434430476ee43c85f161&language=es',
            async: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                obtenerActores(id, json);
                return; 
            },
            error: function (xhr, status, error) {
                console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
    });
}

function obtenerActores(id, arrayJsonPeli){
    $.ajax({
        type: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + id + '/casts?api_key=5c0aaa9071b6434430476ee43c85f161&language=es',
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            var actores = json['cast'];
            generarHtml( arrayJsonPeli, actores);
            return;           
        },
        error: function (xhr, status, error) {
            console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
});
}

function generarHtml(arrayJsonPeli, actores){
        inner += '<div class="col-md-4"><div class="card mb-4 box-shadow"><img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" style="width: 100%; display: block;" src="https://image.tmdb.org/t/p/w500' + arrayJsonPeli['poster_path'] + '" data-holder-rendered="true"><div class="card-body text-center"><h5 class="card-title text-center">' + arrayJsonPeli['title'] + '</h5><div><small class="text-muted"><i class="bi bi-film mx-2"> </i>' + actoresCategorias(arrayJsonPeli['genres'], false) + '</small></div><div><small class="text-muted"><i class="bi bi-calendar3 mx-2"> </i>' + arrayJsonPeli['release_date'] + '</small></div><small class="text-muted"><i class="bi bi-people mx-2"></i>' + actoresCategorias(actores, true) + '</small></div><div class="card-footer bg-primary text-white text-center"><a href="javascript:redirectFilm(' + arrayJsonPeli['id'] + ')" class="text-white"><i class="bi bi-eye"></i> Veure fitxa a IMDB</a></div></div></div>' ;
        return;

}

function actoresCategorias(array, boolean){
    
    if(array.length > 0){
        var nombres = array[0]['name'];

    if(array.length > 1){
        for (let i = 1; i < array.length; i++) {
            nombres += ', ' + array[i]['name'];
            if(boolean && i == 3){
                return nombres;
            }
            
        }
    }
    return nombres;
    }
    return '';
}


$(document).ajaxStart(function(){
    loading.style = 'display: block';
});
$(document).ajaxStop(function(){
    loading.style = 'display: none';
    document.getElementById('movies').innerHTML = inner;
    document.getElementById('suggestions').style = 'display:none';
});
