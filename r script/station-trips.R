library(magrittr)
library(dplyr)
library(lubridate)
library(readr)
library(jsonlite)

# read trip data
trip <- read_csv("201508_trip_data.csv")
dfTrip <- tbl_df(trip)
as_data_frame(dfTrip)

#read station data
station <- read_csv("201508_station_data.csv")
dfStation <- tbl_df(station)
as_data_frame(dfStation)

#add day of the week
dfTripFiltered <- dfTrip
dfTripFiltered$day_of_week <- strftime(mdy_hm(dfTripFiltered$start_date, tz="America/Los_Angeles"), format="%A")

#daywise trip count between stations per subscriber type
dfTripsCnt <- dfTripFiltered %>%
  group_by(start_station, start_terminal, end_station, end_terminal) %>%
  summarise(trips = n())

dfTripsCntWithSubscriber <- dfTripFiltered %>%
  group_by(start_station, start_terminal, end_station, end_terminal, subscriber_type) %>%
  summarise(trips = n())

dfTripsCntDaywise <- dfTripFiltered %>%
  group_by(start_station, start_terminal, end_station, end_terminal, day_of_week) %>%
  summarise(trips = n())

dfTripsCntDaywiseWithSubscriber <- dfTripFiltered %>%
  group_by(start_station, start_terminal, end_station, end_terminal, day_of_week, subscriber_type) %>%
  summarise(trips = n())

#add new column for city
dfTripsCntFinal <- dfTripsCnt
dfTripsCntFinal <- merge(dfTripsCnt, dfStation, by.x="start_terminal", by.y="station_id")
dfTripsCntFinal <- dfTripsCntFinal[c(1:5,10)]

dfTripsCntWithSubscriberFinal <- dfTripsCntWithSubscriber
dfTripsCntWithSubscriberFinal <- merge(dfTripsCntWithSubscriber, dfStation, by.x="start_terminal", by.y="station_id")
dfTripsCntWithSubscriberFinal <- dfTripsCntWithSubscriberFinal[c(1:6,11)]

dfTripsCntDaywiseFinal <- dfTripsCntDaywise
dfTripsCntDaywiseFinal <- merge(dfTripsCntDaywise, dfStation, by.x="start_terminal", by.y="station_id")
dfTripsCntDaywiseFinal <- dfTripsCntDaywiseFinal[c(1:6,11)]

dfTripsCntDaywiseWithSubscriberFinal <- dfTripsCntDaywiseWithSubscriber
dfTripsCntDaywiseWithSubscriberFinal <- merge(dfTripsCntDaywiseWithSubscriber, dfStation, by.x="start_terminal", by.y="station_id")
dfTripsCntDaywiseWithSubscriberFinal <- dfTripsCntDaywiseWithSubscriberFinal[c(1:7,12)]

#dfTripsCntTest <- subset(merge(dfTripsCnt, dfStation, by.x="start_terminal", by.y="station_id"), select = (start_station:trips))

#dfTripsCntTest$city <- dfStation[match(dfTripsCntTest$start_terminal, dfStation$station_id),6]

#dfTripsCntTest$start_lat <- dfStation[match(dfTripsCntTest$start_terminal, dfStation$station_id),"lat"]



#rename landmark column to city column
names(dfStation)
names(dfStation) <- c("station_id", "name", "lat", "long", "dockcount", "city", "installation")

names(dfTripsCntFinal)
names(dfTripsCntFinal) <- c("start_terminal", "start_station", "end_station", "end_terminal", "trips", "city")

names(dfTripsCntWithSubscriberFinal)
names(dfTripsCntWithSubscriberFinal) <- c("start_terminal", "start_station", "end_station", "end_terminal", "subscriber_type", "trips", "city")

names(dfTripsCntDaywiseFinal)
names(dfTripsCntDaywiseFinal) <- c("start_terminal", "start_station", "end_station", "end_terminal", "day_of_week","trips", "city")

names(dfTripsCntDaywiseWithSubscriberFinal)
names(dfTripsCntDaywiseWithSubscriberFinal) <- c("start_terminal", "start_station", "end_station", "end_terminal", "day_of_week","subscriber_type", "trips", "city")

#as_data_frame(dfTripsCntTest)

#generate respective json
jsonData <- toJSON(dfStation)
write(stationJson, "station.json")

jsonData <- toJSON(dfTripsCntFinal)
write(jsonData, "stationTrips.json")

jsonData <- toJSON(dfTripsCntWithSubscriberFinal)
write(jsonData, "stationTripsWithSubscriber.json")

jsonData <- toJSON(dfTripsCntDaywiseFinal)
write(jsonData, "stationTripsDaywise.json")

jsonData <- toJSON(dfTripsCntDaywiseWithSubscriberFinal)
write(jsonData, "stationTripsDaywiseWithSubscriber.json")