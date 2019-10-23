window.onload = async() => {
    var dataindex = 0;
    var articles = [];
    var articles_option = [];
    var data_articles = [];
    var original_labels = [];
    var original_labels_container = [];
    var recommended_labels = [];
    var original_other_labels = [];
    var recommended_other_labels = [];
    var select_options = document.querySelector('#articles');
    var ul_label_original = document.querySelector('#original');
    var article_page_content = document.querySelector('#article');
    var ul_label_recommended = document.querySelector('#recommended');
    var ul_label_original_other = document.querySelector('#original-other');
    var ul_label_recommended_other = document.querySelector('#recommended-other');
    async function LoadContent(dataindex) {
        data_articles = [];
        articles = [];
        articles_option = [];
        original_labels = [];
        recommended_labels = [];
        original_other_labels = [];
        recommended_other_labels = [];
        select_options.innerHTML = "";
        ul_label_original.innerHTML = "";
        article_page_content.innerHTML = "";
        ul_label_recommended.innerHTML = "";
        ul_label_original_other.innerHTML = "";
        ul_label_recommended_other.innerHTML = "";
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

                    let label = original_labels[index - 1].forEach((element) => {
                        splitted_label4.push(element.split(/__label__/));

                    });



                    ul_label_original_other.innerHTML = "";
                    ul_label_recommended.innerHTML = "";
                    ul_label_recommended_other.innerHTML = "";
                    ul_label_original.innerHTML = "";

                    for (let i = 1; i < splitted_label.length; i++) ul_label_recommended.innerHTML += '<li>' + splitted_label[i].replace(/@/g, ' ') + '</li>';
                    for (let i = 1; i < splitted_label2.length; i++) ul_label_recommended_other.innerHTML += '<li>' + splitted_label2[i].replace(/@/g, ' ') + '</li>';
                    for (let i = 1; i < splitted_label3.length; i++) ul_label_original_other.innerHTML += '<li>' + splitted_label3[i].replace(/@/g, ' ') + '</li>';
                    for (let i = 0; i < splitted_label4.length; i++) ul_label_original.innerHTML += '<li>' + splitted_label4[i][1].replace(/@/g, ' ') + '</li>';



                } else {
                    ul_label_recommended.innerHTML = "";
                    article_page_content.innerHTML = "";
                }
            })
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

    var range = document.querySelector('#limiter');
    var range_value = document.querySelector('#limiter-value');
    range_value.innerHTML = range.value;
    range.addEventListener('input', () => {
        range_value.innerHTML = range.value;
    });

};