console.log("releases_docs.js");

let b = document.querySelectorAll('body > pre > a')
let bbb = Array.from(b).slice(1)

// Сортировка строк как чисел
bbb.sort((a, b) => {
    const aParts = a.text.slice(0,-1).split('.').map(Number); // Разбиваем строку на части и преобразуем в числа
    const bParts = b.text.slice(0,-1).split('.').map(Number);

    // Сравниваем каждую часть по очереди
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0; // Если часть отсутствует, считаем ее 0
        const bPart = bParts[i] || 0;

        if (aPart !== bPart) {
            return aPart - bPart; // Возвращаем разницу
        }
    }
    return 0; // Если все части равны
});

bbb.reverse() //переворачиваем массив

//перезаполняем элементы
let div = document.createElement('div')
bbb.forEach(e => {
    let aa = e
    let bb = e.nextSibling

    div.append(aa)
    div.append(bb)
})
b[0].parentElement.append(div)

b = document.querySelectorAll('body > pre > div > a')

//добавляем ссылку на index
if (Object.keys(b).length != 0) {
    Array.from(b).forEach((e,i) => {
        let text = e.text.slice(0,-1)
        let url = text+'/docs-'+text+'-docs.zip!/index.html'
        // 0.0.13/docs-0.0.13-docs.zip!/index.html
        // /%5BRELEASE%5D/docs-%5BRELEASE%5D-docs.zip!/index.html
        e.insertAdjacentHTML('afterend', '<a class="a_full_url" target="_blank" href="'+url+'">'+text+'/index</a>');

        if (i === 0){
            // /%5BRELEASE%5D/docs-%5BRELEASE%5D-docs.zip!/index.html
            text = '%5BRELEASE%5D/docs-%5BRELEASE%5D-docs.zip!/index.html'
            e.insertAdjacentHTML('beforeBegin', '<div class="release"><a target="_blank" href="'+text+'">RELEASE</a></div>');
        }
    })


}
