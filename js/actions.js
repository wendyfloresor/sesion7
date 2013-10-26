//actions
var jQT = new $.jQTouch({
	themeSelectionSelector: '#jqt'
});

$(function(){
    $('#archivos .individual li').tap(function(){
        if($(this).index()==0){
            leerArchivos();
        }else{
            escribirArchivos($('#aEscribir').val());
        }
    });
    
    $('#ncEnv').tap(function(){
        nuevoContacto($('#ncNom').val(),$('#ncTel').val(),$('#ncMail').val());
    });
	$('#contactos .individual li').eq(0).tap(function(){;
        leerContactos();
   });
});
function leerArchivos(){
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        alert(0);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        alert(1);
        fileSystem.root.getFile("readme.txt", null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        alert(2);
        fileEntry.file(readAsText, fail);
    }

    function readAsText(file) {
        alert(3);
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            $('#aLeer').text(evt.target.result);
        };
        alert(reader.readAsText(file));
    }

    function fail(evt) {
        alert(evt.target.error.code);
    }
}

function escribirArchivos(texto){
      document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            navigator.notification.alert('Escrito Satisfactorio',null,'Escribir','Aceptar');
        };
        writer.write(texto);
    }

    function fail(error) {
        alert(error.code);
    }

}

function nuevoContacto(nom,tel,mail){
    document.addEventListener("deviceready",function(){
        var contacto = navigator.contacts.create();
        contacto.displayname = nom;
        contacto.nickname = nom;
        var nombre = new ContactName();
        nombre.givenName = nom;
        nombre.familyName = 'Prueba';
        contacto.name = nombre;
        var telefonos = [];
        telefonos[0] = new ContactField("home",tel,true);
        telefonos[1] = new ContactField("work",'123-456-7890',false);
        contacto.phoneNumbers = telefonos;
        var correos = [];
        correos[0] = new ContactField("home",mail,false);
        correos[1] = new ContactField("work",'ejemplo@cenet.mx',true);
        contacto.emails = correos;
        
        contacto.save(function(){
            navigator.notification.alert("Contacto Guardado Satisfactoriamente", function(){
                window.history.back();
            },"Crear Contacto","Aceptar");
        }, function(err){
            alert(err.code);   
        });
    },false);
}


function leerContactos(){
	document.addEventListener("deviceready",function(){
		function onSuccess(contacts) {
            $('#lcontacto').html('');
			for(i=0; i<contacts.lenght;i++){
				$('#lcontacto').append('<li><a href="tel:'+contacts[i].phoneNumbers[0].value+'">'+contacts[i].name.formated+'<a/></li>');
			}
		};

		function onError(contactError) {
		    alert('onError!');
		};

		// find all contacts with 'Carlos' in any name field
		var options      = new ContactFindOptions();
		options.filter   = "Carlos";
		options.multiple = true;
		var fields       = ["displayName", "name","phoneNumbers"];
		navigator.contacts.find(fields, onSuccess, onError, options);
			
	}, false);
	
}