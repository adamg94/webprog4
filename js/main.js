/*jshint esversion: 8 */
window.onload = async() => {
    var dataindex = 0;
    var articles = [];
    var articles_option = [];
    var data_articles = [];
    var original_labels = [];
    var recommended_labels = [];
    var original_other_labels = [];
    var recommended_other_labels = [];
    var recommended_labels_separated = [];
    var recommended_labels_other_separated = [];
    var select_options = document.querySelector('#articles');
    var ul_label_original = document.querySelector('#original');
    var article_page_content = document.querySelector('#article');
    var ul_label_recommended = document.querySelector('#recommended');
    var ul_label_original_other = document.querySelector('#original-other');
    var ul_label_recommended_other = document.querySelector('#recommended-other');
    var checkbox = document.querySelector('#min3').checked;
    var cb = document.querySelector('#min3');
    var p = document.querySelector('#p');
    var r = document.querySelector('#r');
    async function LoadContent(dataindex) {
        //tömbök kiűrítése, ha fájlcsere van
        data_articles = [];
        articles = [];
        articles_option = [];
        data_articles = [];
        select_options.innerHTML = "";

        await fetch('js/data-splitted-' + dataindex + '.txt').then((res) => res).then(response => {
            response.text().then((text) => {
                data_articles.push(text.split('\n'));
                data_articles[0].unshift('Nincs');
                showContent();
            });
        }).catch(error => console.log(error));
    }
    LoadContent(dataindex);

    function showContent() {
        articles_option.unshift('Nincs');
        for (let i = 0; i < data_articles[0].length; i++) {
            if (data_articles[0][i] != 'Nincs') {
                articles.push(data_articles[0][i].split('$$$')[4].trim());
                articles_option.push(data_articles[0][i].split('$$$')[3].trim());
                original_labels.push(data_articles[0][i].split('$$$')[2].match(/__label__.{1,}?\s/g));
                original_other_labels.push(data_articles[0][i].split('$$$')[2].match(/\s[a-z]{1}.{1,}/g));
                recommended_other_labels.push(data_articles[0][i].split('$$$')[1].trim());
                recommended_labels.push(data_articles[0][i].split('$$$')[0].trim());

                select_options.innerHTML += '<option value="' + i + '">' + articles_option[i] + '</option>';
            } else {
                select_options.innerHTML += '<option value="0">Nincs</option>';
            }

        }


        select_options.querySelectorAll('option').forEach((opt, index) => {
            opt.addEventListener('click', () => {


                if (index != 0) {
                    article_page_content.innerHTML = articles[index - 1];


                    let splitted_label = recommended_labels[index - 1].split(/__label__/);
                    let splitted_label2 = recommended_other_labels[index - 1].split(/__label__/);
                    let splitted_label3 = original_other_labels[index - 1][0].trim().split(/\s/);
                    let splitted_label4 = [];

                    original_labels[index - 1].forEach((element) => {
                        splitted_label4.push(element.split(/__label__/));

                    });


                    ul_label_original_other.innerHTML = "";

                    ul_label_original.innerHTML = "";
                    recommended_labels_separated = [];
                    recommended_labels_other_separated = [];

                    for (let i = 1; i < splitted_label.length; i++) {
                        let data = splitted_label[i].replace(/@/g, ' ');
                        let data1 = data.match(/[A-zÀ-ú ]{1,}/g);
                        let data2 = data.match(/[.0-9]{1,}/g);

                        recommended_labels_separated.push([data1[0], data2[0]]);

                    }


                    for (let i = 1; i < splitted_label2.length; i++) {
                        let data = splitted_label2[i].replace(/@/g, ' ');
                        let data1 = data.match(/[A-zÀ-ú ]{1,}/g);
                        let data2 = data.match(/[.0-9]{1,}/g);

                        recommended_labels_other_separated.push([data1[0], data2[0]]);

                    }

                    //pr számítás

                    let precision = 0;

                    for (let i = 0; i < recommended_labels_separated.length; i++) {
                        for (let j = 0; j < splitted_label4.length; j++) {
                            let temp1 = (recommended_labels_separated[i][0].trim());
                            let temp2 = (splitted_label4[j][1].replace(/@/g, ' ').trim());
                            if (temp1 == temp2) {
                                precision++;

                            }
                        }
                    }
                    for (let i = 0; i < recommended_labels_other_separated.length; i++) {
                        for (let j = 0; j < splitted_label3.length; j++) {
                            let temp1 = (recommended_labels_other_separated[i][0].trim());
                            let temp2 = (splitted_label3[j].replace(/@/g, ' ').trim());
                            if (temp1 == temp2) {
                                precision++;

                            }
                        }
                    }

                    p.innerHTML = 'P: ' + (precision / (recommended_labels_separated.length + recommended_labels_other_separated.length)).toFixed(2);
                    r.innerHTML = 'R: ' + (precision / (splitted_label3.length + splitted_label4.length)).toFixed(2);

                    /**
                     * A mintaképen a Research Motion cikk esetében P: 0.766 van, míg R: 0.318.
                     * Sehogysem tudtam kihozni ezeket a számokat, de az R az 0.75, ami közel van a mintaképen P-hez,
                     * és a kiszámított P pedig 0,3 ami meg közel van az R-hez a mintaképen.
                     * Nem lett véletlenül felcserélve a mintaképen annak a kettőnek a kiírása?
                     * 
                     * A másik probléma, hogy a kapott adatok még ígyis valamelyest eltérnének a mintaképen szereplőtől, de a számítások el lettek végezve.
                     */


                    for (let i = 1; i < splitted_label3.length; i++) ul_label_original_other.innerHTML += '<li>' + splitted_label3[i].replace(/@/g, ' ') + '</li>';
                    for (let i = 0; i < splitted_label4.length; i++) ul_label_original.innerHTML += '<li>' + splitted_label4[i][1].replace(/@/g, ' ') + '</li>';


                    ul_label_recommended.innerHTML = "";
                    ul_label_recommended_other.innerHTML = "";
                    if (checkbox) {
                        for (let i = 0; i < 3; i++) {
                            ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[i][0] + '(' + parseFloat(recommended_labels_separated[i][1]).toFixed(2) + ')</li>';
                            ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[i][0] + '(' + parseFloat(recommended_labels_other_separated[i][1]).toFixed(2) + ')</li>';
                        }
                    } else {
                        ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[0][0] + '(' + parseFloat(recommended_labels_separated[0][1]).toFixed(2) + ')</li>';
                        ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[0][0] + '(' + parseFloat(recommended_labels_other_separated[0][1]).toFixed(2) + ')</li>';
                    }


                } else {
                    ul_label_recommended.innerHTML = "";
                    ul_label_recommended_other.innerHTML = "";
                    ul_label_original.innerHTML = "";
                    ul_label_original_other.innerHTML = "";
                    article_page_content.innerHTML = "";
                    p.innerHTML = "P: ";
                    r.innerHTML = "R: ";
                }
            });
        });
    }
    var setLeftToZero = document.querySelector('#button-left-0');
    var setRightToMax = document.querySelector('#button-right-99');
    var setLeftBy1 = document.querySelector('#button-left-1');
    var setRightBy1 = document.querySelector('#button-right-1');
    setLeftToZero.addEventListener('click', () => {
        if (dataindex != 0) {
            dataindex = 0;
            LoadContent(dataindex);
        }
    });
    setRightToMax.addEventListener('click', () => {
        if (dataindex != 99) {
            dataindex = 99;
            LoadContent(dataindex);
        }
    });
    setLeftBy1.addEventListener('click', () => {
        if (dataindex - 1 > -1) {
            dataindex--;
            LoadContent(dataindex);
        }
    });
    setRightBy1.addEventListener('click', () => {
        if (dataindex + 1 < 100) {
            dataindex++;
            LoadContent(dataindex);
        }
    });
    cb.addEventListener('change', () => {
        ul_label_recommended.innerHTML = "";
        ul_label_recommended_other.innerHTML = "";
        if (cb.checked) {
            for (let i = 0; i < 3; i++) {
                ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[i][0] + '(' + parseFloat(recommended_labels_separated[i][1]).toFixed(2) + ')</li>';
                ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[i][0] + '(' + parseFloat(recommended_labels_other_separated[i][1]).toFixed(2) + ')</li>';
            }
        } else {
            ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[0][0] + '(' + parseFloat(recommended_labels_separated[0][1]).toFixed(2) + ')</li>';
            ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[0][0] + '(' + parseFloat(recommended_labels_other_separated[0][1]).toFixed(2) + ')</li>';
        }
    });
    var range = document.querySelector('#limiter');
    var range_value = document.querySelector('#limiter-value');


    range_value.innerHTML = range.value;
    range.addEventListener('input', () => {
        range_value.innerHTML = range.value;
        let value = range.value;
        ul_label_recommended.innerHTML = "";
        ul_label_recommended_other.innerHTML = "";
        if (!cb.checked) {
            for (let i = 0; i < recommended_labels_separated.length; i++) {
                if (value < parseFloat(recommended_labels_separated[i][1])) {
                    ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[i][0] + '(' + parseFloat(recommended_labels_separated[i][1]).toFixed(2) + ')</li>';
                }
            }
            for (let i = 0; i < recommended_labels_other_separated.length; i++) {
                if (value < parseFloat(recommended_labels_other_separated[i][1])) {
                    ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[i][0] + '(' + parseFloat(recommended_labels_other_separated[i][1]).toFixed(2) + ')</li>';
                }
            }
        } else {
            for (let i = 0; i < 3; i++) {
                ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[i][0] + '(' + parseFloat(recommended_labels_separated[i][1]).toFixed(2) + ')</li>';
                ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[i][0] + '(' + parseFloat(recommended_labels_other_separated[i][1]).toFixed(2) + ')</li>';
            }
            for (let i = 4; i < recommended_labels_separated.length; i++) {
                if (value < parseFloat(recommended_labels_separated[i][1])) {
                    ul_label_recommended.innerHTML += '<li>' + recommended_labels_separated[i][0] + '(' + parseFloat(recommended_labels_separated[i][1]).toFixed(2) + ')</li>';
                }
            }
            for (let i = 4; i < recommended_labels_other_separated.length; i++) {
                if (value < parseFloat(recommended_labels_other_separated[i][1])) {
                    ul_label_recommended_other.innerHTML += '<li>' + recommended_labels_other_separated[i][0] + '(' + parseFloat(recommended_labels_other_separated[i][1]).toFixed(2) + ')</li>';
                }
            }
        }


    });


};