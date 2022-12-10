interface Person {
  readonly id: number;
  name: string;
  age?: number;

  [propName: string]: any;
}

let tom: Person = {
  id: 89757,
  name: 'Tom',
  gender: 'male'
};

// readonly 不能赋值
// tom.id = 9527;

interface Cat {
  name: string;

  run(): void;
}

interface Fish {
  name: string;

  swim(): void;
}

function isFish(animal: Cat | Fish) {
  return typeof (animal as Fish).swim === 'function';
}


let message:string = 'hello'
