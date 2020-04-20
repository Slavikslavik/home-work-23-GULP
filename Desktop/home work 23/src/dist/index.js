"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Todo = /*#__PURE__*/function () {
  function Todo(form, list, template) {
    _classCallCheck(this, Todo);

    this.form = form;
    this.list = list;
    this.template = template;
    this.notes = [];
  }

  _createClass(Todo, [{
    key: "init",
    value: function init() {
      var _this = this;

      //если нет авторизации
      var token = localStorage.getItem('access_token');

      if (token) {
        // this.getTask();
        // this.render();
        this.form.addEventListener('submit', function (e) {
          e.preventDefault();
          var note = document.querySelector('.form_task').value; //console.log(note);

          _this.append(note);

          _this.getTask();

          _this.render();
        });
      } else {
        alert('write your id');
      }

      this.list.addEventListener('click', function (_ref) {
        var target = _ref.target;
        var isCompleteBtn = target.tagName === 'BUTTON' && target.classList.contains('note__button-done');
        var editButton = target.tagName === 'BUTTON' && target.classList.contains('note__button--edit');
        var currentNoteId = target.closest('li').dataset.id;

        if (isCompleteBtn) {
          _this.complete(Number(currentNoteId));
        } else if (editButton) {
          _this.edit(Number(currentNoteId));
        } else {
          _this.remove(Number(currentNoteId));
        }
      });
    }
  }, {
    key: "append",
    value: function append(note) {
      var _this2 = this;

      var task = {
        value: note,
        priority: 1
      };
      var options = {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(localStorage.getItem('access_token'))
        }
      };
      fetch('https://todo.hillel.it/todo', options).then(function (response) {
        return response.json();
      }).then(function (notein) {
        _this2.notes.unshift(notein);

        _this2.render();

        _this2.form.reset();
      })["catch"](function (error) {
        return alert('sorry, shit happends POST !!!!');
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      this.list.innerHTML = '';
      this.notes.forEach(function (note) {
        _this3.list.insertAdjacentHTML('afterbegin', _this3.template(note));
      });
    }
  }, {
    key: "getTask",
    value: function getTask() {
      var _this4 = this;

      var options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(localStorage.getItem('access_token'))
        }
      };
      fetch('https://todo.hillel.it/todo', options).then(function (result) {
        return result.json();
      }).then(function (result) {
        //console.log(result);
        _this4.notes = result;

        _this4.render();
      })["catch"](function (error) {
        return alert('Ooops..GET');
      });
    }
  }, {
    key: "getAccess",
    value: function getAccess(id) {
      var _this5 = this;

      var options = {
        method: 'POST',
        body: JSON.stringify({
          value: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch('https://todo.hillel.it/auth/login', options).then(function (response) {
        return response.json();
      }).then(function (result) {
        //console.log(result);
        localStorage.setItem('access_token', result.access_token);

        _this5.getTask();
      })["catch"](function (error) {
        return alert('sorry, shit happends');
      });
    }
  }]);

  return Todo;
}();

var ListTodo = /*#__PURE__*/function (_Todo) {
  _inherits(ListTodo, _Todo);

  var _super = _createSuper(ListTodo);

  function ListTodo() {
    _classCallCheck(this, ListTodo);

    return _super.apply(this, arguments);
  }

  _createClass(ListTodo, [{
    key: "edit",
    value: function edit(id) {
      var _this6 = this;

      var edit = document.querySelector('.edit');
      edit.classList.remove('hidden');
      this.notes.find(function (note) {
        if (note._id === id) {
          //console.log(note);
          edit.innerHTML = "<h1 class=\"header\">  Make Changes \n                <input type=\"text\" class=\"edit_value\"  value=\"".concat(note.value, "\">\n                <div class=\"button1s\">\n                <button class=\"button1\" data-action=\"save\" >save</button>\n                <button class=\"button1\" data-action=\"cancel\" >cancel</button>\n                </div>\n                </h1>");
          fetch("https://todo.hillel.it/todo/".concat(note._id), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(localStorage.getItem('access_token'))
            },
            body: JSON.stringify(note)
          }).then(function (result) {
            return result.json();
          }).then(function (result) {
            //console.log(result)
            document.querySelector('.button1s').addEventListener('click', function (e) {
              e.preventDefault();

              if (e.target.dataset.action === 'save') {
                //console.log('save');
                note.value = document.querySelector('.edit_value').value;

                _this6.render();
              }

              if (e.target.dataset.action === 'cancel') {
                edit.classList.toggle('hidden'); //console.log(edit);
              }
            });
          });
        }
      });
    }
  }, {
    key: "complete",
    value: function complete(id) {
      var _this7 = this;

      this.notes.find(function (note) {
        // console.log(note._id);
        if (note._id === id) {
          fetch("https://todo.hillel.it/todo/".concat(note._id, "/toggle"), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(localStorage.getItem('access_token'))
            }
          }).then(function (result) {
            return result.json();
          }).then(function (note) {
            //console.log(note);
            note.checked = true;

            _this7.getTask(); //this.render();

          });
        }
      });
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var _this8 = this;

      this.notes.find(function (note) {
        if (note._id === id) {
          fetch("https://todo.hillel.it/todo/".concat(note._id), {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(localStorage.getItem('access_token'))
            }
          }).then(function (result) {
            return result.json();
          }).then(function (result) {
            _this8.notes.splice(_this8.notes.indexOf(note), 1);

            _this8.render(); //    console.log(result);
            //    this.notes.push(result);

          });
        }
      });
    }
  }]);

  return ListTodo;
}(Todo);

var first = new ListTodo(document.querySelector('.note'), document.querySelector('.note_list'), function (note) {
  return "\n    <li data-id=\"".concat(note._id, "\"  >\n    <span class=\"note__text ").concat(note.checked ? "note__text--completed" : "", "\" > ").concat(note.value, "</span>   \n    <button class=\"note__button note__button-done\" ").concat(note.checked ? "disabled" : "", " data-action =\"done\">DONE</button>\n    <button class=\"note__button note__button--remove\" data-action = \"remove\">Remove</button>\n    <button class=\"note__button note__button--edit\" ").concat(note.checked ? "disabled" : "", " data-action = \"edit\">EDIT</button>\n    </li>");
});
document.querySelector('.login').addEventListener('submit', function (e) {
  e.preventDefault(); //console.log('qwe');

  var id = document.querySelector('.form_input').value; //console.log(typeof id);

  first.getAccess(id);
});
first.init();