class APIFeatures {
    constructor(model, query) {
      this.model = model;
      this.query = query || model;
    }
  
    filter() {
      const where = this.query.where || {};
      this.query = this.query.where(where);
      return this;
    }
  
    sort() {
      const order = this.query.sort ? this.query.sort.split(',').map((item) => item.split(' ')) : [];
      this.query = this.query.order(order);
      return this;
    }
  
    limitFields() {
      const attributes = this.query.fields ? this.query.fields.split(',') : [];
      this.query = this.query.attributes(attributes);
      return this;
    }
  
    paginate() {
      const page = this.query.page || 1;
      const limit = this.query.limit || 100;
      const offset = (page - 1) * limit;
  
      this.query = this.query.limit(limit).offset(offset);
      return this;
    }
  
    async get() {
      return await this.query.findAll();
    }
  }
  
module.exports = APIFeatures;
  