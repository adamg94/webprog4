window.onload = async() => {
    let dataindex = 0, // oldalbetöltéskor az első txt betöltése
        articles = [],
        articles_option = [],
        data_articles = [],
        original_labels = [],
        recommended_labels = [],
        original_other_labels = [],
        recommended_other_labels = [],
        recommended_labels_separated = [],
        recommended_labels_other_separated = [],
        select_options = document.querySelector("#articles"),
        ul_label_original = document.querySelector("#original"),
        article_page_content = document.querySelector("#article"),
        ul_label_recommended = document.querySelector("#recommended"),
        ul_label_original_other = document.querySelector("#original-other"),
        ul_label_recommended_other = document.querySelector("#recommended-other"),
        setLeftToZero = document.querySelector("#button-left-0"),
        setRightToMax = document.querySelector("#button-right-99"),
        setLeftBy1 = document.querySelector("#button-left-1"),
        setLeftBy10 = document.querySelector("#button-left-10"),
        setRightBy1 = document.querySelector("#button-right-1"),
        setRightBy10 = document.querySelector("#button-right-10"),
        range = document.querySelector("#limiter"),
        range_value = document.querySelector("#limiter-value"),
        checkbox = document.querySelector("#min3"),
        p = document.querySelector("#p"),
        r = document.querySelector("#r"),
        LoadContent = async(dataindex) => {
            //tömbök, egyebek kiűrítése, ha fájlcsere van
            articles = [],
                articles_option = [],
                data_articles = [],
                original_labels = [],
                recommended_labels = [],
                original_other_labels = [],
                recommended_other_labels = [],
                recommended_labels_separated = [],
                recommended_labels_other_separated = [],
                select_options.innerHTML = "";
            ul_label_original.innerHTML = "";
            article_page_content.innerHTML = "";
            ul_label_recommended.innerHTML = "";
            ul_label_original_other.innerHTML = "";
            ul_label_recommended_other.innerHTML = "";
            p.innerHTML = "";
            r.innerHTML = "";
            await fetch("js/data-splitted-" + dataindex + ".txt").then((res) => res).then(response => {
                response.text().then((text) => {
                    data_articles.push(text.split("\n"));
                    showContent();
                });
            }).catch(error => console.log(error));
        },
        showContent = () => {
            for (let i = 0; i < data_articles[0].length; i++) {
                articles.push(data_articles[0][i].split("$$$")[4].trim());
                articles_option.push(data_articles[0][i].split("$$$")[3].trim());
                original_labels.push(data_articles[0][i].split("$$$")[2].match(/__label__.{1,}?\s/g));
                original_other_labels.push(data_articles[0][i].split("$$$")[2].match(/\s[a-z]{1}.{1,}/g));
                recommended_other_labels.push(data_articles[0][i].split("$$$")[1].trim());
                recommended_labels.push(data_articles[0][i].split("$$$")[0].trim());
                select_options.innerHTML += "<option value=" + i + ">" + articles_option[i] + "</option>";
            }
            select_options.addEventListener("change", () => {
                showByIndex(select_options.selectedIndex);
            });
            showByIndex(0); //betöltéskor az első cikk adatainak megjelenítése
        },
        showByIndex = (index) => {
            article_page_content.innerHTML = articles[index];
            let splitted_label = recommended_labels[index].split(/__label__/);
            let splitted_label2 = recommended_other_labels[index].split(/__label__/);
            let splitted_label3 = original_other_labels[index][0].trim().split(/\s/);
            let splitted_label4 = [];
            original_labels[index].forEach((element) => {
                splitted_label4.push(element.split(/__label__/));
            });
            ul_label_original_other.innerHTML = "";
            ul_label_original.innerHTML = "";
            recommended_labels_separated = [];
            recommended_labels_other_separated = [];
            for (let i = 1; i < splitted_label.length; i++) {
                let data = splitted_label[i].replace(/@/g, " ");
                let data1 = data.match(/[A-zÀ-ú ]{1,}/g);
                let data2 = (data.match(/[.0-9]{1,}/g));
                recommended_labels_separated.push([data1[0], parseFloat(data2[0])]);
            }
            for (let i = 1; i < splitted_label2.length; i++) {
                let data = splitted_label2[i].replace(/@/g, " ");
                let data1 = data.match(/[A-zÀ-ú ]{1,}/g);
                let data2 = (data.match(/[.0-9]{1,}/g));
                recommended_labels_other_separated.push([data1[0], parseFloat(data2[0])]);
            }
            //pr számítás
            let precision = 0;
            for (let i = 0; i < recommended_labels_separated.length; i++) {
                for (let j = 0; j < splitted_label4.length; j++) {
                    let temp1 = (recommended_labels_separated[i][0].trim());
                    let temp2 = (splitted_label4[j][1].replace(/@/g, " ").trim());
                    if (temp1 == temp2) {
                        precision++;
                    }
                }
            }
            for (let i = 0; i < recommended_labels_other_separated.length; i++) {
                for (let j = 0; j < splitted_label3.length; j++) {
                    let temp1 = (recommended_labels_other_separated[i][0].trim());
                    let temp2 = (splitted_label3[j].replace(/@/g, " ").trim());
                    if (temp1 == temp2) {
                        precision++;
                    }
                }
            }
            p.innerHTML = "P: " + (precision / (recommended_labels_separated.length + recommended_labels_other_separated.length)).toFixed(3);
            r.innerHTML = "R: " + (precision / (splitted_label3.length + splitted_label4.length)).toFixed(3);
            /**
             * A mintaképen a Research Motion cikk esetében P: 0.766 van, míg R: 0.318.
             * Nem tudtam kihozni ezeket a számokat, nekem az R: 0.75, ami közel van a mintaképen P-hez,
             * és a P: 0.30 ami meg közel van az R-hez a mintaképen.
             * Nem lett véletlenül felcserélve a mintaképen annak a kettőnek a kiírása?
             * 
             * A másik probléma, hogy a kapott adatok még ígyis eltérnének, de a számítások el lettek végezve.
             */
            for (let i = 0; i < splitted_label3.length; i++) ul_label_original_other.innerHTML += "<li>" + splitted_label3[i].replace(/@/g, " ") + "</li>";
            for (let i = 0; i < splitted_label4.length; i++) ul_label_original.innerHTML += "<li>" + splitted_label4[i][1].replace(/@/g, " ") + "</li>";
            rangeIndicatorAndChecbBox(); //oldalbetöltéskor és új fájl cserekor is jelenjenek meg a címkék a checkbox állásától függően
        },
        rangeIndicatorAndChecbBox = () => {
            let value = range.value;
            range_value.innerHTML = value;
            ul_label_recommended.innerHTML = "";
            ul_label_recommended_other.innerHTML = "";
            if (!checkbox.checked) {
                for (let i = 0; i < recommended_labels_separated.length; i++) {
                    if (value < recommended_labels_separated[i][1]) {
                        ul_label_recommended.innerHTML += "<li>" + recommended_labels_separated[i][0] + "(" + recommended_labels_separated[i][1].toFixed(2) + ")</li>";
                    }
                }
                for (let i = 0; i < recommended_labels_other_separated.length; i++) {
                    if (value < recommended_labels_other_separated[i][1]) {
                        ul_label_recommended_other.innerHTML += "<li>" + recommended_labels_other_separated[i][0] + "(" + recommended_labels_other_separated[i][1].toFixed(2) + ")</li>";
                    }
                }
            } else {
                for (let i = 0; i < 3; i++) {
                    ul_label_recommended.innerHTML += "<li>" + recommended_labels_separated[i][0] + "(" + recommended_labels_separated[i][1].toFixed(2) + ")</li>";
                    ul_label_recommended_other.innerHTML += "<li>" + recommended_labels_other_separated[i][0] + "(" + recommended_labels_other_separated[i][1].toFixed(2) + ")</li>";
                }

                for (let i = 4; i < recommended_labels_separated.length; i++) {
                    if (value < recommended_labels_separated[i][1]) {
                        ul_label_recommended.innerHTML += "<li>" + recommended_labels_separated[i][0] + "(" + recommended_labels_separated[i][1].toFixed(2) + ")</li>";
                    }
                }
                for (let i = 4; i < recommended_labels_other_separated.length; i++) {
                    if (value < recommended_labels_other_separated[i][1]) {
                        ul_label_recommended_other.innerHTML += "<li>" + recommended_labels_other_separated[i][0] + "(" + recommended_labels_other_separated[i][1].toFixed(2) + ")</li>";
                    }
                }
            }
        };
    setLeftToZero.addEventListener("click", () => {
        if (dataindex != 0) {
            dataindex = 0;
            LoadContent(dataindex);
        }
    });
    setRightToMax.addEventListener("click", () => {
        if (dataindex != 99) {
            dataindex = 99;
            LoadContent(dataindex);
        }
    });
    setLeftBy1.addEventListener("click", () => {
        if (dataindex > 0) {
            dataindex--;
            LoadContent(dataindex);
        }
    });
    setRightBy1.addEventListener("click", () => {
        if (dataindex < 99) {
            dataindex++;
            LoadContent(dataindex);
        }
    });
    setLeftBy10.addEventListener("click", () => {
        if (dataindex - 10 > 0) {
            dataindex -= 10;
            LoadContent(dataindex);
        } else {
            dataindex = 0;
            LoadContent(dataindex);
        }
    });
    setRightBy10.addEventListener("click", () => {
        if (dataindex + 10 < 99) {
            dataindex += 10;
            LoadContent(dataindex);
        } else {
            dataindex = 99;
            LoadContent(dataindex);
        }
    });
    checkbox.addEventListener("change", () => {
        rangeIndicatorAndChecbBox()
    });
    range.addEventListener("input", () => {
        rangeIndicatorAndChecbBox()
    });
    range_value.innerHTML = range.value; //oldalbetöltéskor jelenjen meg a default érték
    LoadContent(dataindex); //oldalbetöltéskor is legyen tartalom
};