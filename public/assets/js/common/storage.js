export class Storage {
  constructor(key) {
    this.key = key;
  }

  set(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  get() {
    const value = localStorage.getItem(this.key);
    return value ? JSON.parse(value) : null;
  }
}

export class StudyStorage extends Storage {
  constructor() {
    super("arcana_study_progress");
  }

  setQuestion(id) {
    this.set({
      id: id,
      index: 0,
      mistake: [],
    });
  }
}
