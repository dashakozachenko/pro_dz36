'use strict';

const view = {
    controller: null,
    formId: null,
    form: null,
    todoContainerId: null,
    todoContainer: null,
    currentItemId: null,
    removeAllBtn: null,

    getObjKeyValues(formId, containerId) {
        if (!formId) throw new Error("Error formId!");
        if (!containerId) throw new Error("Error containerId!");

        this.formId = formId;
        this.todoContainerId = containerId;

        this.form = document.getElementById(formId);
        if (this.form.nodeName !== "FORM")
            throw new Error("Form is not defined");

        this.todoContainer = document.getElementById(containerId);
    },

    getRemoveAllBtn() {
        this.removeAllBtn = this.form.querySelector(".remove-all");
    },

    setEvents() {
        this.form.addEventListener("submit", this.formHandler.bind(this));

        document.addEventListener("DOMContentLoaded", this.prefillForm.bind(this));

        this.todoContainer.addEventListener("click", this.removeElement.bind(this));

        this.removeAllBtn.addEventListener("click", this.removeAllTodos.bind(this));
    },

    prefillForm() {
        const data = this.controller.getData(this.formId);

        if (!data || !data.length) return;

        const iterator = data[Symbol.iterator]();
        let item = iterator.next();

        while (!iterator.done) {
            const element = item.value;
            if (item.done) break;

            this.todoContainer.prepend(this.createTemplate(element));
            item = iterator.next();
        }
    },

    formHandler(event) {
        event.preventDefault();
        ++this.currentItemId;

        let data = {
            id: this.formId,
            itemId: this.currentItemId,

            ...this.findInputs(),
        };

        this.controller.saveData(data);

        this.todoContainer.append(this.createTemplate(data));

        event.target.reset();
    },

    createTemplate({ title, description, itemId}) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('col-4');

        let wrapInnerContent = '<div class="taskWrapper">';
        wrapInnerContent += `<div class="taskHeading">${title}</div>`;
        wrapInnerContent += `<div class="taskDescription">${description}</div>`;
        wrapInnerContent += `<button class="btn btn-primary delete-btn" data-item-id="${itemId}">Delete</button>`
        wrapInnerContent += '</div>';

        wrapper.innerHTML = wrapInnerContent;

        wrapper
            .querySelector('input[type=checkbox]')

        return wrapper;
    },

    removeElement({ target }) {
        if (!target.classList.contains("delete-btn")) return;

        this.controller.removeItem(
            this.formId,
            target.getAttribute("data-item-id")
        );

        target.closest(".taskWrapper").parentElement.remove();
    },

    removeAllTodos() {
        this.controller.removeAll(this.formId);
        this.todoContainer.innerHTML = "";
    },

    findInputs() {
        return Array.from(
            this.form.querySelectorAll("input[type=text], textarea")
        ).reduce((acc, { name, value }) => {
            acc[name] = value;
            return acc;
        }, {});
    },

    init(controllerInstance) {
        this.getObjKeyValues("todoForm", "todoItems");
        this.getRemoveAllBtn();
        this.setEvents();

        this.controller = controllerInstance;
    },
};
