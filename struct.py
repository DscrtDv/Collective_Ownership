import random

class Person:  
    def __init__(self, name, current_task, prev_task, prev_task2):
        self.name = name
        self.current_task = current_task
        self.prev_task = prev_task
        self.prev_task2 = prev_task2

class Task:
    def __init__(self, name, spots, size):
        self.name = name
        self.spots = []
        self.size = size

def populateTask(fd):
    taskarray = []
    with open(fd) as file:
        for line in file:
            line = line.strip()
            temp = line.split(" ")
            taskarray.append(Task(temp[0], None, temp[1]))
        file.close()
    return taskarray

def populatePerson(fd):
    personArray = []
    with open(fd) as file:
        for line in file:
            line = line.strip()
            temp = line.split(" ")
            personArray.append(Person(temp[0], temp[1], temp[2], temp[3]))
        file.close()
    return personArray

def getRandomIndex(list):
    if len(list) > 1:
        rand_index = random.randint(0, len(list) - 1)
        return rand_index
    return 0

def getRandomPerson(list):
    index = getRandomIndex(list)
    if list[index].current_task is None:
        person = list.pop(index)
        return (person)
    getRandomPerson(list, task)

def findAvailableActor(task, list):
    available = []
    for person in list:
        if person.current_task is None and  person.prev_task != task and person.prev_task2 != task:
            available.append(person)
    return available

def assignTask(list):
    for task in taskArray:
        while len(task.spots) < int(task.size) and list:
            available = findAvailableActor(task.name, list)
            person = getRandomPerson(available)
            if not person or not available:
                break
            task.spots.append(person.name)
            person.current_task = task.name
            result.append(person)
            #print(person.name, person.current_task)
    matchRemainingTask(list)

def defineTaskLess(list):
    taskLess = []
    for person in list:
        if person.current_task is None:
            taskLess.append(person)
    return taskLess

def defineActorLess():
    actorLess = []
    for task in taskArray:
        if len(task.spots) < int(task.size):
            actorLess.append(task)
    return actorLess

def matchRemainingTask(list):
    remain_t = defineActorLess()
    remain_a = defineTaskLess(list)
    if remain_t:
        for person in remain_a:
            rand_index = random.randint(0, len(remain_t) - 1)
            task = remain_t.pop(rand_index)
            task.spots.append(person.name)
            person.current_task = task.name
            result.append(person)

def newCleaningSchedule(list):
    for person in list:
        if person.prev_task:
            person.prev_task2 = person.prev_task
        if person.current_task:
            person.prev_task = person.current_task
            person.current_task = None;
    assignTask(list)

personArray = populatePerson("schedule_24/02.txt")
taskArray = populateTask("tasks.txt")
result = []
newCleaningSchedule(personArray)

fd = open("schedule_24/03.txt", "w")

if (len(result) <= 20):
    for person in result:
        line = person.name + " " + person.current_task + " " + person.prev_task + " " + person.prev_task2 + "\n"
        print(line);
        fd.write(line)
fd.close()

