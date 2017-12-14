import {Dispatcher} from "../dispatcher";
import * as Actions from "../actions";

const TEST_ACTION_1 = "TEST_ACTION_1";
const testAction1 = (arg) => ({type: TEST_ACTION_1, arg});

const TEST_ACTION_2 = "TEST_ACTION_2";
const testAction2 = () => ({type: TEST_ACTION_2});

describe("dispatcher tests", () => {
   let dispatcher;
   beforeEach(() => dispatcher = new Dispatcher());


   it("Dispatches a simple action", () => {

       // Arrange
       let result = 0;
        dispatcher.on(TEST_ACTION_1, action => {
            result = action.arg;
        });

        // Act
        dispatcher.emit(testAction1(42));

        // Assert
        expect(result).toBe(42);

   });

   it("allows us to unsubscribe", () => {

        // Arrange
        let count = 0;
        const sub = dispatcher.on(TEST_ACTION_1, () => count++);

        // Act
        dispatcher.emit(testAction1(4));
        sub();
        dispatcher.emit(testAction1(1));

        // Assert
        expect(count).toBe(1)
   });

   it("allows object syntax for actions", () => {

        // Arrange
        let action1Count = 0;
        let action2Count = 0;
        dispatcher.on({
            [TEST_ACTION_1]: () => action1Count++,
            [TEST_ACTION_2]: () => action2Count++
        });

        // Act
        dispatcher.emit(testAction1(12));
        dispatcher.emit(testAction2());

        // Assert
        expect(action1Count).toBe(1);
        expect(action2Count).toBe(1);
   });

   it("allows us to subscribe with rxjs", () => {

       // Arrange
       let action1Arg = 0;
       dispatcher.on$(TEST_ACTION_1).subscribe(action => action1Arg = arction.arg);

       // Act
       dispatcher.emit(testAction1(42));

       // Assert
       expect(action1Arg).toBe(42);
   });

});
