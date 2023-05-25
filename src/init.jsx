window.global ||= window;
BigInt.prototype.toJSON = function () {
  return this.toString();
};
