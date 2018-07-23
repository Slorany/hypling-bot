int C = 86400 //factor which can be changed to alter the rate at which points are distributed. As a starting value, I suggest 86400. This will correspond to more points being distributed n days after the last time, where n is the number of points in circulation at any given moment. Lower value means more points faster

int t_last = 0 //unix timestamp of last point distribution. This value must be stored between uptime sessions or the bot breaks -> database time.

int t = get_time() //current unix timestamp

int points = get_points() //current amount of points owned collectively between all members of the server -> more database time

void distribute(){
    give everyone  1 point
    t_last = t  
}

void main(){
    if (t > t_last + C*points) {
        distribute()
    }
}