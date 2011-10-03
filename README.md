BOOTSTRAP
=================

Bootstrap - заготовки для ускоренного создания сайтов, в том числе:

* Заготовка страницы HTML5 (нет смысла использовать xHTML, ie6-8 все равно отображают в Standarts Mode)
* Заготовка для написания плагина jQuery с нуля - plugin-template.js
* CSS cтили(csskit.css) для стилизации форм, сгенерированных Django: 
``` html
<form action="." method="post">{% csrf_token %}
{{ form.as_eul }}
<input type="submit" value="Отправить" />
</form>
```
* Файл стилей и скрипт для всплывающего попапа
* Стили для пагинатора, breadcrumb(хлебных крошек)
* Ротатор, ротатор-лайт(для мобильных устройств)
* Заготовка сайта на Django с настроенным скриптом html5boilerplate
* Простенький сайт с файлом стилей, написанным на LESS, SASS и т.п.

Как использовать
-----

TODO

``` html
<script src="common.js" type="text/javascript"></script>
```

Or if you prefer, the standard css way:

``` html
<link rel="stylesheet" type="text/css" href="csskit.css">
```

Баг-трекер
-----------

Нашли баг? Добавьте его описание в разделе issues:

https://github.com/i-akhmadullin/bootstrap/issues


Copyright and license
---------------------

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.