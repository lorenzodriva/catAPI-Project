export function abrirModal(breed, imageUrl) {
    const modal = document.getElementById('modal-detalle');

    document.getElementById('modal-nombre').textContent = breed.name;
    document.getElementById('modal-descripcion').textContent = breed.description;
    document.getElementById('modal-vida').textContent = breed.life_span + ' años';
    document.getElementById('modal-peso').textContent = breed.weight.metric + ' kg';
    document.getElementById('modal-wiki').href = breed.wikipedia_url || '#';
    document.getElementById('modal-hipo').textContent = breed.hypoallergenic ? 'Sí' : 'No';
    document.getElementById('modal-img').src = imageUrl;

    document.getElementById('niños').value = breed.child_friendly || 0;
    document.getElementById('perros').value = breed.dog_friendly || 0;
    document.getElementById('inteligencia').value = breed.intelligence || 0;
    document.getElementById('afecto').value = breed.affection_level || 0;
    document.getElementById('salud').value = breed.health_issues || 0;
    document.getElementById('pelaje').value = breed.grooming || 0;
    document.getElementById('muda').value = breed.shedding_level || 0;

    modal.classList.remove('oculto');
}
