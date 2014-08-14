jQuery(document).ready(function(e) {
	// Definition du canal de connection
    var connection = new RTCMultiConnection();
	
	// Definition des entrées / sorties
	connection.session = {
		audio: true,
		video: true
	};

	// Ajouter une balise video (appelee lors de chaque connection)
	connection.onstream = function(e) {
		videosContainer.insertBefore(e.mediaElement, videosContainer.firstChild);
		if(videosContainer.childNodes.length >= 2){
			jQuery("#waiting").hide();
		}
	};

	// Supprimer une balise video (appelee lors de chaque deconnection)
	connection.onstreamended = function(e) {
		e.mediaElement.style.opacity = 0;
		setTimeout(function() {
			if (e.mediaElement.parentNode) {
				e.mediaElement.parentNode.removeChild(e.mediaElement);
			}
		}, 1000);
		if(videosContainer.childNodes.length >= 2){
			jQuery("#waiting").show();
		}
	};
	
	// Definition du mode de connection par defaut : open (pour ouvrir une nouvelle connection
	var connectionMode = "open";
	
	// Joindre une session ouverte (appelee que si une premiere connection est trouvee)
	connection.onNewSession = function(session) {
		// Redefinir le mode de connection
		connectionMode = "join";
		// Rejoindre la session
		connection.join(session);
	};

	// Definition du conteneur des balises video
	// Si l'id videos-container n'est pas trouve alors la balise body devient le conteneur
	var videosContainer = document.getElementById('videos-container') || document.body;
	
	// Attendre 2s pour se synchroniser avec la fonction précédente puis lancer testConnection()
	window.setTimeout(testConnection,2000)
	function testConnection(){
		// Si nous n'avons pas rejoint une session, on la crée
		if(connectionMode=='open'){
			connection.extra = {
				'session-name': document.getElementById('conference-name').value
			};
			connection.open();
		}
	}
	
	// Etablir la connection
	connection.connect();
});