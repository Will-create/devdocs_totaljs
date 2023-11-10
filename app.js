require('total4');
var food = 'riz';
/**
 * 
 * @param {*} quelquechose 
 * @param {*} servir 
 */
function preparer(quelquechose, servir) {

    setTimeout(() => {
        poid = 4;
        console.log('La preparation du {0} est terminee🍛🥙🍕🥗🥘🫕'.format(quelquechose));
        if (quelquechose.length < poid)
            servir && servir('{0} est finie'.format(quelquechose), quelquechose);
        else
            servir && servir(null, quelquechose)
    }, 3000);
}

preparer(food, function(err, nourriture) {
    if (!err)
        console.warn('SERVICE TERMINE: {0} 🍛🥙🍕🥗🥘🫕'.format(nourriture))
    else 
        console.error(err);
});
