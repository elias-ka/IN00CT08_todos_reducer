import { StatusBar } from "expo-status-bar";
import { useReducer, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type AddTodo = { type: "add_todo"; payload: string };
type RemoveTodo = { type: "remove_todo"; payload: number };
type Action = AddTodo | RemoveTodo;

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

const reducer = (state: { todos: Todo[] }, action: Action) => {
  switch (action.type) {
    case "add_todo":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, done: false },
        ],
      };
    case "remove_todo":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, { todos: [] });
  const [input, setInput] = useState("");

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch({ type: "add_todo", payload: input });
      setInput("");
    }
  };

  const handleRemoveTodo = (id: number) => {
    dispatch({ type: "remove_todo", payload: id });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add new..."
            value={input}
            onChangeText={setInput}
          />
          <Pressable onPress={handleAddTodo}>
            <Text style={{ fontSize: 22 }}>Save</Text>
          </Pressable>
        </View>
        <FlatList
          data={state.todos}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleRemoveTodo(item.id)}>
              <View style={styles.todoItem}>
                <Text style={styles.todoText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={styles.todoList}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 20,
    fontSize: 16,
  },
  todoList: {
    marginTop: 20,
  },
  todoItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  todoText: {
    fontSize: 18,
  },
});
