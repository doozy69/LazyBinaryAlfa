onload = (event) => {
    console.log("index.js")
    start()
    menu()
    images()

    if (checkDateNewYear()){//проверка по дате
        chrome.storage.sync.get('newYear', function(data) { //проверка по состоянию
            if(data.newYear){
                newyear()            
            }else{
                document.querySelector(".spanTree").classList.add("spanTreeGray")//вешаем серость на елку
            }
        })
    }
    
    //подгрузка начального состояния показа или скрытия, работает в методе showHideNotMethod
    chrome.storage.sync.get('notMethod', function(data) {
        if (data.notMethod){
            document.querySelector(".showNotMethod").style.backgroundImage = 'url('+chrome.runtime.getURL("../img/hidden.png")+')';
            document.querySelectorAll(".notMethod").forEach((s)=>
                s.classList.add('openNotMethod')
            )
        }else{
            document.querySelector(".showNotMethod").style.backgroundImage = 'url('+chrome.runtime.getURL("../img/eye.png")+')';
            document.querySelectorAll(".notMethod").forEach((s)=>
                s.classList.remove('openNotMethod')
            )
        }
    });

    //показать\скрыть меню
    document.addEventListener('keydown', function(event) {
      if (event.code == 'KeyQ' && event.repeat == false) {
      let div = document.querySelector(".dz_menu")
        div.style.display = (div.style.display == "none") ? "block" : "none";
      }
    });
    //показать\скрыть не методы
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyW' && event.repeat == false && document.querySelector(".dz_menu").style.display == "block") {
            showHideNotMethod();
        }
    });
    //показать скрыть новогоднюю мотню
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyE' && event.repeat == false && document.querySelector(".dz_menu").style.display == "block" && checkDateNewYear()) {
            showHideNewYear();
        }
    });
    //показать скрыть левое меню
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyZ' && event.repeat == false) {
            showHideLeftMenu();
        }
    });

    window.addEventListener('scroll', debounce(function() {start()}, 100));
};

//создает меню и наполняет его
function menu(){
    console.log("dz_menu")
        let div = document.createElement('div')
        div.className = "dz_menu"
        div.style.display = "none"
        let divHeader = document.createElement('div')
        divHeader.className = "divHeader"

        let spanHeader = document.createElement('span')
        spanHeader.className = "showNotMethod"

        divHeader.appendChild(document.querySelector("#header > h1").cloneNode(true), spanHeader)
        spanHeader.style.backgroundImage = 'url('+chrome.runtime.getURL("../img/eye.png")+')';

        if (checkDateNewYear()){
            let spanTree = document.createElement('span')
            spanTree.className = "spanTree"
            spanTree.style.backgroundImage = 'url('+chrome.runtime.getURL("../img/tree.png")+')';
            //добавляем иконки в меню, сначала елку, чтобы не ломать последовательность
            divHeader.appendChild(spanTree)

            spanTree.addEventListener('click', (e) => {
                showHideNewYear()
            })
        }

        //добавление иконки release\snapshots
        let spanReleases = document.createElement('a')
        spanReleases.className = "spanReleasesSnapshots"
        spanReleases.textContent = "R"
        spanReleases.title = "Releases"
        spanReleases.href = window.location.href.slice(0, window.location.href.indexOf('/docs/'))+"/docs/"
        spanReleases.href = spanReleases.href.replace('snapshots', 'releases')
        

        let spanSnapshots = document.createElement('a')
        spanSnapshots.className = "spanReleasesSnapshots"
        spanSnapshots.textContent = "S"
        spanSnapshots.title = "Snapshots"
        spanSnapshots.href = window.location.href.slice(0, window.location.href.indexOf('/docs/'))+"/docs/"
        spanSnapshots.href = spanSnapshots.href.replace('releases', 'snapshots')

        if (window.location.href.includes('/releases/')){
            spanReleases.classList.add('spanRSActive')
        }else if (window.location.href.includes('/snapshots/')){
            spanSnapshots.classList.add('spanRSActive')
        }

        divHeader.appendChild(spanReleases)
        divHeader.appendChild(spanSnapshots)
        
        //добавляем иконки в меню
        divHeader.appendChild(spanHeader)
        div.appendChild(divHeader)

        let ul = document.createElement('ul');
        div.appendChild(ul)
        ul.className = "dz_menu_ul";

        //обработка события слика на иконку меню
        spanHeader.addEventListener('click', (e) => {
            showHideNotMethod()
        })
        
        document.querySelectorAll('.sect1 > h2').forEach((sec) => {
            let li = document.createElement('li');
            let menuLink = document.querySelector("a[href='#"+sec.id+"']").cloneNode(true) //копируем ссылку из меню слева

            if (/^(post|get|put|delete|patch)/.test(sec.id)){//если это метод
                
                let code = menuLink.querySelector("code")
                let codeText = code.textContent;

                let type = cutStringAtFirstSpace(codeText); // Обрезаем строку до первого слова
                let span = document.createElement('span');

                span.className = type.toLowerCase()
                span.textContent = type

                code.textContent = subStringAtFirstSpace(codeText)

                code.before(span)

                li.appendChild(menuLink)
                ul.appendChild(li)
            }else{//если это не метод
                if (!/^(user-stories|feature-toggle|описание-системных-параметров|требования-к-логированию|отчет-о-тестировании)/.test(sec.id)){
                    let code = menuLink.querySelector("code")
                    
                    if (code){
                        let codeText = code.textContent;
                        code.remove();
                        menuLink.append(codeText);
                    }
                    
                    li.className= 'notMethod'
                    li.appendChild(menuLink)
                    ul.appendChild(li)
                }
            }
        })
        document.querySelector("#content").append(div);
}

//скрытие левого меню
function showHideLeftMenu(){
    if (document.getElementById('toc').classList.contains('toc2') && document.body.classList.contains('toc2')){
        document.getElementById('toc').classList.remove('toc2');
        document.body.classList.remove('toc2');
        //чтобы основной контент был слева
        document.querySelectorAll('#header, #content, #footnotes, #footer').forEach((s)=>
            s.classList.add('clearMargin')
        )
    }else{
        document.getElementById('toc').classList.add('toc2');
        document.body.classList.add('toc2');
        document.querySelectorAll('#header, #content, #footnotes, #footer').forEach((s)=>
            s.classList.remove('clearMargin')
        )
    }
}

//скрытие новогодней мотни
function showHideNewYear(){
    chrome.storage.sync.get('newYear', function(data) { //проверка по состояниюe
        chrome.storage.sync.set({ newYear: !data.newYear });
    })
    document.querySelector(".spanTree").classList.toggle('spanTreeGray')
}

//действи показа и скрытия не методов
function showHideNotMethod(){
    document.querySelectorAll(".notMethod").forEach((s)=>
        s.classList.toggle('openNotMethod')
    )

    let spanHeader = document.querySelector(".showNotMethod")

    if (document.querySelector(".notMethod").classList.contains('openNotMethod')){
        spanHeader.style.backgroundImage = 'url('+chrome.runtime.getURL("../img/hidden.png")+')';
        chrome.storage.sync.set({ notMethod: true });
    }else{
        spanHeader.style.backgroundImage = 'url('+chrome.runtime.getURL("../img/eye.png")+')';
        chrome.storage.sync.set({ notMethod: false });
    }
}

//результат до первого пробела
function cutStringAtFirstSpace(str) {
    const index = str.indexOf(' ');
    if (index === -1) {
        return str;
    }
    return str.slice(0, index);
}

//результат после первого пробела
function subStringAtFirstSpace(str){
    let resultString;
    let firstSpaceIndex = str.indexOf(' ');
    if (firstSpaceIndex !== -1) {
        resultString = str.substring(firstSpaceIndex + 1); // Удаляем до первого пробела
    } else {
        resultString = str; // Если пробелов нет, возвращаем оригинальную строку
    }
    return resultString;
}

//функция для отложенного вызова процесса, на таймере
function debounce(func, wait) {
  let timeout;

  return function executedFunction() {
    let later = function() {
      clearTimeout(timeout);
      func();
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

function start(){
    document.querySelectorAll('.sect1 > h2').forEach((sec) => {

        let menuLink = document.querySelectorAll("a[href='#"+sec.id+"']")
        let top = sec.parentElement.getBoundingClientRect().top + window.scrollY

        if (window.scrollY >= top && window.scrollY < top + sec.parentElement.offsetHeight) {
            menuLink.forEach((s) => s.classList.add('active'));
        } else {
            menuLink.forEach((s) => s.classList.remove('active'))
        }
      });
}

function images(){
    const thumbnails = document.querySelectorAll('img');
    

    const span = document.createElement('span');
    span.textContent = "close";
    span.className = "close"
    document.body.appendChild(span);

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (e) => {
            // Удаляем все ранее увеличенные изображения
            const existingLargeImage = document.querySelector('.large-image');
            if (existingLargeImage) {
                existingLargeImage.remove();
            }

            // Создаем элемент для увеличенного изображения
            const largeImage1 = document.createElement('img');
            largeImage1.src = thumbnail.src; // Копируем источник миниатюры
            //div.classList.add('large-image');
            //КАК ТО В БУДУЩЕМ, СДЕЛАТЬ ОТКРЫТИЕ КАРТИНОК В ОТДЕЛЬНОМ ОКНЕ, ОНО СЕЙЧАС НЕ РАБОТАЕТ
            // const win = window.open('', '_blank'); // открываем окно
            // win.document.write("<img src='" + thumbnail.src + "' alt='from old image' />"); //  вставляем картинку
            
            //var w = window.open("");
            // w.document.write("image.outerHTML");


            const largeImage = document.createElement('div');
            //const span = document.createElement('span');
            //span.textContent = "close";
            const span =  document.querySelector('.close')
            span.classList.add('active_span')

            largeImage.classList.add('large-image');
            largeImage.appendChild(largeImage1);
            //largeImage.appendChild(span);
            document.body.appendChild(largeImage);

            // Устанавливаем позицию для увеличенного изображения
            largeImage.style.left = `${e.target.getBoundingClientRect().left + window.scrollX}px`;
            largeImage.style.top = `${e.target.getBoundingClientRect().top + window.scrollY}px`;

            largeImage.style.display = 'block';

            let dragging = false

            // Начальные координаты
            let startX = 0
            let startY = 0
            let scale = 0

            // Событие при перетаскивании элемента
            largeImage.addEventListener('mousedown', (e) => {
              dragging = true

              const style = window.getComputedStyle(largeImage)

              // Преобразуем матрицу
              const transform = new DOMMatrixReadOnly(style.transform)

              const translateX = transform.m41
              const translateY = transform.m42
              scale = transform.m11

              startX = e.pageX - translateX
              startY = e.pageY - translateY
              e.preventDefault();
            })

            // Обрабатываем событие перемещения мыши по <body>
            document.body.addEventListener('mousemove', (e) => {
              e.preventDefault();
              if (!dragging) return

              const x = e.pageX - startX
              const y = e.pageY - startY

              largeImage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`

            })

            // Отпускаем мышь
            document.body.addEventListener('mouseup', () => {
              dragging = false
            })

            largeImage.addEventListener('wheel', (e) => {
                e.preventDefault(); // Предотвращаем прокрутку страницы
                const style = window.getComputedStyle(largeImage)

                const transform = new DOMMatrixReadOnly(style.transform)

                let scale = transform.m11

                if (e.deltaY < 0) {
                    scale+=0.1
                } else {
                    scale+=-0.1
                }
                largeImage.style.transform = `translate(${transform.m41}px, ${transform.m42}px) scale(${scale})`
            });

            const deleteButtons = document.querySelectorAll('.large-image span');

            // Добавляем обработчик события клика для каждого span
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Находим родительский div и удаляем его
                    const container = this.closest('.large-image');
                    if (container) {
                        container.remove();
                    }
                });
            });

            const spanQQ =  document.querySelector('.close')
            const largeImageQQ = document.querySelector('.large-image')
            spanQQ.addEventListener('click', function() {
                    largeImageQQ.remove();
                    spanQQ.classList.remove('active_span')
                })

        });
    });
}


//___________________________________НОВОГОДНЯЯ МОТНЯ
function newyear(){
    'use strict';
    let body = document.querySelector("body")

    let divNewYear = document.createElement('div')
    divNewYear.className = "newyear"

    divNewYear.innerHTML = `
        <div class="b-page_newyear">
            <div class="b-page__content">
            <i class="b-head-decor">
                <i class="b-head-decor__inner b-head-decor__inner_n1">
                    <div class="b-ball b-ball_n1 b-ball_bounce" data-note="0"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n2 b-ball_bounce" data-note="1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n3 b-ball_bounce" data-note="2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n4 b-ball_bounce" data-note="3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n5 b-ball_bounce" data-note="4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n6 b-ball_bounce" data-note="5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n7 b-ball_bounce" data-note="6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n8 b-ball_bounce" data-note="7"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n9 b-ball_bounce" data-note="8"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
                <i class="b-head-decor__inner b-head-decor__inner_n2">
                    <div class="b-ball b-ball_n1 b-ball_bounce" data-note="9"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n2 b-ball_bounce" data-note="10"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n3 b-ball_bounce" data-note="11"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n4 b-ball_bounce" data-note="12"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n5 b-ball_bounce" data-note="13"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n6 b-ball_bounce" data-note="14"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n7 b-ball_bounce" data-note="15"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n8 b-ball_bounce" data-note="16"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n9 b-ball_bounce" data-note="17"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
                <i class="b-head-decor__inner b-head-decor__inner_n3">
                    <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                    <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
                <i class="b-head-decor__inner b-head-decor__inner_n4">
                <div class="b-ball b-ball_n1 b-ball_bounce" data-note="27"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n2 b-ball_bounce" data-note="28"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n3 b-ball_bounce" data-note="29"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n4 b-ball_bounce" data-note="30"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n5 b-ball_bounce" data-note="31"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n6 b-ball_bounce" data-note="32"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n7 b-ball_bounce" data-note="33"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n8 b-ball_bounce" data-note="34"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n9 b-ball_bounce" data-note="35"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
                <i class="b-head-decor__inner b-head-decor__inner_n5">
                <div class="b-ball b-ball_n1 b-ball_bounce" data-note="0"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n2 b-ball_bounce" data-note="1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n3 b-ball_bounce" data-note="2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n4 b-ball_bounce" data-note="3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n5 b-ball_bounce" data-note="4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n6 b-ball_bounce" data-note="5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n7 b-ball_bounce" data-note="6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n8 b-ball_bounce" data-note="7"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n9 b-ball_bounce" data-note="8"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
                <i class="b-head-decor__inner b-head-decor__inner_n6">
                <div class="b-ball b-ball_n1 b-ball_bounce" data-note="9"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n2 b-ball_bounce" data-note="10"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n3 b-ball_bounce" data-note="11"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n4 b-ball_bounce" data-note="12"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n5 b-ball_bounce" data-note="13"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n6 b-ball_bounce" data-note="14"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n7 b-ball_bounce" data-note="15"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n8 b-ball_bounce" data-note="16"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n9 b-ball_bounce" data-note="17"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
                <i class="b-head-decor__inner b-head-decor__inner_n7">
                <div class="b-ball b-ball_n1 b-ball_bounce" data-note="18"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n2 b-ball_bounce" data-note="19"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n3 b-ball_bounce" data-note="20"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n4 b-ball_bounce" data-note="21"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n5 b-ball_bounce" data-note="22"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n6 b-ball_bounce" data-note="23"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n7 b-ball_bounce" data-note="24"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n8 b-ball_bounce" data-note="25"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_n9 b-ball_bounce" data-note="26"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i1"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i2"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i3"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i4"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i5"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                <div class="b-ball b-ball_i6"><div class="b-ball__right"></div><div class="b-ball__i"></div></div>
                </i>
            </i>
            </div>
        </div>
    `;

    body.prepend(divNewYear)

    document.querySelectorAll('.b-page_newyear .b-head-decor').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-head-decor_newyear.png")+') repeat-x 0 0');
    document.querySelectorAll('.b-ball_n1 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n1.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n2 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n2.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n3 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n3.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n4 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n4.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n5 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n5.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n6 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n6.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n7 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n7.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n8 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n8.png")+') no-repeat');
    document.querySelectorAll('.b-ball_n9 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_n9.png")+') no-repeat');
    document.querySelectorAll('.b-ball_i1 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_i1.png")+') no-repeat');
    document.querySelectorAll('.b-ball_i2 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_i2.png")+') no-repeat');
    document.querySelectorAll('.b-ball_i3 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_i3.png")+') no-repeat');
    document.querySelectorAll('.b-ball_i4 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_i4.png")+') no-repeat');
    document.querySelectorAll('.b-ball_i5 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_i5.png")+') no-repeat');
    document.querySelectorAll('.b-ball_i6 .b-ball__i').forEach(e=>e.style.background = 'url('+chrome.runtime.getURL("newyear/balls/b-ball_i6.png")+') no-repeat');

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Balls = function () {
    function Balls(context, buffer) {
        _classCallCheck(this, Balls);

        this.context = context;
        this.buffer = buffer;
    }

    _createClass(Balls, [{
        key: 'setup',
        value: function setup() {
        this.gainNode = this.context.createGain();
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
        }
    }, {
        key: 'play',
        value: function play() {
        this.setup();
        this.source.start(this.context.currentTime);
        }
    }, {
        key: 'stop',
        value: function stop() {
        var ct = this.context.currentTime + 1;
        this.gainNode.gain.exponentialRampToValueAtTime(.1, ct);
        this.source.stop(ct);
        }
    }]);

    return Balls;
    }();

    var Buffer = function () {
    function Buffer(context, urls) {
        _classCallCheck(this, Buffer);

        this.context = context;
        this.urls = urls;
        this.buffer = [];
    }

    _createClass(Buffer, [{
        key: 'loadSound',
        value: function loadSound(url, index) {
        var request = new XMLHttpRequest();
        request.open('get', url, true);
        request.responseType = 'arraybuffer';
        var thisBuffer = this;
        request.onload = function () {
            thisBuffer.context.decodeAudioData(request.response, function (buffer) {
            thisBuffer.buffer[index] = buffer;
            if (index == thisBuffer.urls.length - 1) {
                thisBuffer.loaded();
            }
            });
        };
        request.send();
        }
    }, {
        key: 'getBuffer',
        value: function getBuffer() {
        var _this = this;

        this.urls.forEach(function (url, index) {
            _this.loadSound(url, index);
        });
        }
    }, {
        key: 'loaded',
        value: function loaded() {
        _loaded = true;
        }
    }, {
        key: 'getSound',
        value: function getSound(index) {
        return this.buffer[index];
        }
    }]);

    return Buffer;
    }();

    var balls = null,
        preset = 0,
        _loaded = false;
    var path = chrome.runtime.getURL("")+'newyear/audio/';
    var sounds = [path + 'sound1.mp3', path + 'sound2.mp3', path + 'sound3.mp3', path + 'sound4.mp3', path + 'sound5.mp3', path + 'sound6.mp3', path + 'sound7.mp3', path + 'sound8.mp3', path + 'sound9.mp3', path + 'sound10.mp3', path + 'sound11.mp3', path + 'sound12.mp3', path + 'sound13.mp3', path + 'sound14.mp3', path + 'sound15.mp3', path + 'sound16.mp3', path + 'sound17.mp3', path + 'sound18.mp3', path + 'sound19.mp3', path + 'sound20.mp3', path + 'sound21.mp3', path + 'sound22.mp3', path + 'sound23.mp3', path + 'sound24.mp3', path + 'sound25.mp3', path + 'sound26.mp3', path + 'sound27.mp3', path + 'sound28.mp3', path + 'sound29.mp3', path + 'sound30.mp3', path + 'sound31.mp3', path + 'sound32.mp3', path + 'sound33.mp3', path + 'sound34.mp3', path + 'sound35.mp3', path + 'sound36.mp3'];
    var context = new (window.AudioContext || window.webkitAudioContext)();

    function playBalls() {
    var index = parseInt(this.dataset.note) + preset;
    balls = new Balls(context, buffer.getSound(index));
    balls.play();
    }

    function stopBalls() {
    balls.stop();
    }

    var buffer = new Buffer(context, sounds);
    var ballsSound = buffer.getBuffer();
    var buttons = document.querySelectorAll('.b-ball_bounce');
    buttons.forEach(function (button) {
    button.addEventListener('mouseenter', playBalls.bind(button));
    button.addEventListener('mouseleave', stopBalls);
    });

    function ballBounce(e) {
    var i = e;
    if (e.className.indexOf(" bounce") > -1) {
        return;
    }
    toggleBounce(i);
    }

    function toggleBounce(i) {
    i.classList.add("bounce");
    function n() {
        i.classList.remove("bounce");
        i.classList.add("bounce1");
        function o() {
        i.classList.remove("bounce1");
        i.classList.add("bounce2");
        function p() {
            i.classList.remove("bounce2");
            i.classList.add("bounce3");
            function q() {
            i.classList.remove("bounce3");
            }
            setTimeout(q, 300);
        }
        setTimeout(p, 300);
        }
        setTimeout(o, 300);
    }
    setTimeout(n, 300);
    }

    var array1 = document.querySelectorAll('.b-ball_bounce');
    var array2 = document.querySelectorAll('.b-ball_bounce .b-ball__right');

    for (var i = 0; i < array1.length; i++) {
    array1[i].addEventListener('mouseenter', function () {
        ballBounce(this);
    });
    }

    for (var i = 0; i < array2.length; i++) {
    array2[i].addEventListener('mouseenter', function () {
        ballBounce(this);
    });
    }

    var l = ["49", "50", "51", "52", "53", "54", "55", "56", "57", "48", "189", "187",
        //  "81", "87", "69",
          "82", "84", "89", "85", "73", "79", "80", "219", "221", "65", "83", "68", "70", "71", "72", "74", "75", "76", "186", "222", "220"];
    var k = ["90", "88", "67", "86", "66", "78", "77", "188", "190", "191"];
    var a = {};
    for (var e = 0, c = l.length; e < c; e++) {
    a[l[e]] = e;
    }
    for (var _e = 0, _c = k.length; _e < _c; _e++) {
    a[k[_e]] = _e;
    }

    document.addEventListener('keydown', function (j) {
    var i = j.target;
    if (j.which in a) {
        console.log(j.which)
        var index = parseInt(a[j.which]);
        balls = new Balls(context, buffer.getSound(index));
        balls.play();
        var ball = document.querySelector('[data-note="' + index + '"]');
        toggleBounce(ball);
    }
    });

}


//проверка что новогоднюю мотню можно показать, условия показа от 10/12/currentYear до 10/01/currentYear+1
function checkDateNewYear(){
    var currentDate = new Date();
    var from = new Date('12/10');
    var to   = new Date('01/10');

    from.setFullYear(currentDate.getFullYear());
    to.setFullYear(currentDate.getFullYear()+1);

    //console.log(currentDate, from, to, currentDate >= from && currentDate <= to)

    return(currentDate > from && currentDate < to);
}