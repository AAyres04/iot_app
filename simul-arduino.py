import sys
try:
    import paho.mqtt.client as mqtt #import the client1
except ImportError:
    print('Error, paho no esta instalado, use "pip install paho-mqtt"')
    sys.exit(-1)
import time
import random
#Mensajes

temperaturaMax=25
ppmMax=200
isOpen = False
isPuriferOn = False

def on_message(client, userdata, message):
    message_str = str(message.payload.decode("utf-8"))
    print("Mensaje recibido: " ,message_str)
    print("message topic =",message.topic)
    print("message qos=",message.qos)
    print("message retain flag=",message.retain)

def on_message_config(client, userdata, message):
    message_str = str(message.payload.decode("utf-8"))
    print("Mensaje recibido: " ,message_str)
    print("message topic =",message.topic)
    print("message qos=",message.qos)
    print("message retain flag=",message.retain)
    parse_config(message_str)

def on_message_default_config(client,userdata,message):
    message_str = str(message.payload.decode("utf-8"))
    print("Mensaje recibido: " ,message_str)
    print("message topic =",message.topic)
    print("message qos=",message.qos)
    print("message retain flag=",message.retain)
    if(message_str == "default_config"):
        client_config.publish(topico_config,'temperaturaMax:' + str(temperaturaMax) + "\n" + 'ppmMax:' + str(ppmMax)
            + "\n" + 'isOpen:' + str(isOpen) + "\n" + "isPuriferOn:" + str(isPuriferOn)
        )

def random_temp():
    return random.randint((temperaturaMax-2),(temperaturaMax+1))
def random_ppm():
    return random.randint((ppmMax-30),(ppmMax+15))

def parse_config(message : str):
    message_split = message.split("\n")
    tempMaxSplit = message_split[0].split(":")
    ppmMaxSplit = message_split[1].split(":")
    isOpenSplit = message_split[2].split(":")
    isPuriferOnSplit = message_split[3].split(":")
    global temperaturaMax 
    temperaturaMax  = int(tempMaxSplit[1])
    global ppmMax 
    ppmMax = int(ppmMaxSplit[1])
    global isOpen
    isOpen = parseBool(isOpenSplit[1])
    global isPuriferOn
    isPuriferOn = parseBool(isPuriferOnSplit[1])

def parseBool(normalBool : str):
    if(normalBool == "True"):
        return True
    else:
        return False


#Creación y conexión broker
broker_address="broker.emqx.io" #broker externo

topico_config="ejemplomqtt/mbaaaam/config"
random_number_config = random.randint(1,9999)
client_id_config = "P" + str(random_number_config)
print("Creando nueva instancia client_config")
client_config = mqtt.Client(client_id_config)
client_config.on_message=on_message_config #devolución de llamada
print("Cliente config conectando al broker " + topico_config)
client_config.connect(broker_address) #conexión al cliente

client_config.loop_start()
print("Suscribiendose al tópico",topico_config)
client_config.subscribe(topico_config)

topico_default_config="ejemplomqtt/mbaaaam/config/default"
random_number_default_config=random.randint(20000,29999)
client_id_default_config = "P" + str(random_number_default_config)
print("Creando nueva instancia client_default_config")
client_default_config = mqtt.Client(client_id_default_config)
client_default_config.on_message=on_message_default_config
print("Cliente default config conectando al broker " + topico_default_config)
client_default_config.connect(broker_address)

client_default_config.loop_start()
print("Suscribiendose al tópico",topico_default_config)
client_default_config.subscribe(topico_default_config)

topico="ejemplomqtt/mbaaaam"
random_number = random.randint(10000,19999)
client_id = "P" + str(random_number)
print("Creando nueva instancia client_data")
client_data = mqtt.Client(client_id) #Crear nueva instancia
client_data.on_message=on_message #devolución de llamada
print("Cliente data conectando al broker " + topico)
client_data.connect(broker_address) #conexión al cliente

client_data.loop_start() #Inicio de loop
print("Suscribiendose al tópico",topico)
client_data.subscribe(topico)

time.sleep(1)
print('...Generando valores')

while True:
    try:
        temp = random_temp()
        ppm = random_ppm()
        msg = "temperatura:" + str(temp) + "\n" + "ppm:" + str(ppm)
        client_data.publish(topico,msg)
        time.sleep(5)
    except KeyboardInterrupt:
        print('Cerrando...')
        client_data.loop_stop()
        client_config.loop_stop()
        client_default_config.loop_stop()
        sys.exit(0)