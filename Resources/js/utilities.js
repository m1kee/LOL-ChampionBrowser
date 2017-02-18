// funcion que retorna el string con la primera letra en mayusculas y el resto en minusculas
function primerLetraMayuscula(string){
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// funcion que retorna true si 'string' está dentro de 'cadena'
function meContiene(cadena, string)
{
	if(cadena.toLowerCase().indexOf(string.toLowerCase()) != -1){
		return true;
	}
	return false;
}
