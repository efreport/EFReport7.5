function efalert(obj , msg , ico){
    obj.alert(msg, {icon:ico});
}

function efalert1(obj , msg){
    obj.alert(msg, {icon: 2, shift: 5}, function(index) {
        layer.close(index);
    });
}

function efalert2(obj , msg){
    obj.alert(msg, { shift: 5}, function(index) {
        window.location.reload();
    })
}