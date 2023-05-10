import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const [toDoList, setTodoList] = useState([]);

  const navigation = useNavigation();

  const handleAddTodo = (value) => {
    setTodoList(list => ([
      ...list,
      value,
    ]));
  };

  const handleRemoveTodo = (idx) => {
    setTodoList(list => {
      const arr = [...list];
      arr.splice(idx, 1);

      return arr;
    });
  }

  useEffect(() => {
    setInterval(() => {
        setTodoList(list => {
          return list.map(item => {
            return {
              ...item,
              timer: item?.timer >= 1000 ? item?.timer - 1000 : item?.timer,
            };
          });
        });
    }, 1000);
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headline}>To-Do Lists</Text>
        <View style={styles.toDoContainer}>
          {toDoList.map((todo, idx) => {
            const diff = todo.timer;
            const diffHour = Math.floor(diff / 3600000);
            const diffMinute = Math.floor(diff / 60000);
            const diffSecond = ((diff % 60000) / 1000).toFixed(0);

            return (
              <View style={styles.toDoItem} key={todo.title}>
                <View style={styles.toDoItemDetails}>
                  <Text style={styles.toDoText}>{todo.title}</Text>
                  <Text style={styles.toDoText}>{todo.description}</Text>
                  <Text style={styles.toDoText}>{diffHour % 24}:{diffMinute % 60}:{diffSecond % 60}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.doneButton]}
                  onPress={() => handleRemoveTodo(idx)}
                >
                  <Text style={styles.doneButtonText}>Mark as Done</Text>
                </TouchableOpacity>
              </View>
            )
          })}

          {!toDoList.length && (
            <View style={styles.noContent}>
              <Text style={styles.noContentText}>No to-do items!</Text>
            </View>
          )}

          {toDoList.some(todo => todo.timer < 1000) && (
            <View style={styles.toDoItemExpired}>
              <Text style={styles.toDoItemExpiredText}>You have a due todo!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={() => navigation.push('AddToDo', {
          handleAddTodo
        })}
      >
        <Text style={styles.buttonText}>Add To-Do</Text>
      </TouchableOpacity>
    </View>
  )
}

function AddToDoScreen({ route }) {
  const { params } = route;
  const { handleAddTodo } = params;

  const [value, setValue] = useState({});

  const navigation = useNavigation();

  const addTimer = timer => {
    handleAddTodo({
      ...value,
      timer: (timer.hour * 60 * 60 + timer.minute * 60 + timer.second) * 1000,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headline}>Add To-Do</Text>

        <TextInput
          placeholder='Enter title here...'
          style={styles.input}
          onChangeText={text => {
            setValue(value => {
              return {
                ...value,
                title: text,
              };
            });
          }}
          value={value.title}
        />

        <TextInput
          placeholder='Enter description here...'
          style={styles.input}
          onChangeText={text => {
            setValue(value => {
              return {
                ...value,
                description: text,
              };
            });
          }}
          value={value.description}
        />

        <TouchableOpacity
          onPress={() => navigation.push('AddTimer', {
            addTimer
          })}
          style={[styles.button, styles.addButton]}
        >
          <Text style={styles.buttonText}>Add To-Do</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function TimerScreen({ route }) {
  const { params } = route;
  const { addTimer } = params;

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const navigation = useNavigation();

  return (
    <View>
      <ScrollView>

        <View style={styles.timeInputContainer}>
          <Text>Hours</Text>
          <TextInput
            placeholder="00"
            style={styles.input}
            onChangeText={text => {
              setHour(parseInt(text) || 0);
            }}
            value={hour}
          />
          <Text>Minutes</Text>
          <TextInput
            placeholder="00"
            style={styles.input}
            onChangeText={text => {
              setMinute(parseInt(text) || 0);
            }}
            value={minute}
          />
          <Text>Seconds</Text>
          <TextInput
            placeholder="00"
            style={styles.input}
            onChangeText={text => {
              setSecond(parseInt(text) || 0);
            }}
            value={second}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            addTimer({
              hour,
              minute,
              second,
            });

            navigation.goBack();
          }}
          style={[styles.button, styles.addButton]}
        >
          <Text style={styles.buttonText}>Create To-Do</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
      >
        <Stack.Screen
          name='Home'
          component={HomeScreen}
        />
        <Stack.Screen
          name='AddToDo'
          component={AddToDoScreen}
          option={{
            ttle: 'Add To-Do'
          }}
        />
        <Stack.Screen
          name='AddTimer'
          component={TimerScreen}
          option={{
            ttle: 'Add Timer'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 30,
    alignItems: "stretch"
  },
  headline: {
    fontSize: 30,
    marginBottom: 15
  },
  toDoContainer: {
    flexDirection: "column",
    flex: 1,
  },
  toDoItemExpired: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "red",
    borderRadius: 12,
    padding: 22,
  },
  toDoItemExpiredText: {
    color: "white",
  },
  toDoItem: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    backgroundColor: "white",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 15,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10
  },

  toDoItemDetails: {
    flex: 1,
    flexDirection: "column",
  },
  toDoText: {
    marginRight: 15
  },
  doneButton: {
    marginLeft: "auto",
    margin: 0,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  doneButtonText: {
    color: "white"
  },
  toDoText: {
    fontSize: 16
  },
  noContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  noContentText: {
    opacity: 0.5,
    alignSelf: "center",
    textAlign: "center"
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: "#bebebe",
    borderRadius: 30,
    borderWidth: 1,
    width: "100%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#7e7e7e",
    alignSelf: "center",
  },
  addButton: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#7cc767",
    margin: 30
  },
  buttonText: {
    color: "white",
    fontSize: 20
  },
  timeInputContainer: {
    padding: 32,
  }
});
