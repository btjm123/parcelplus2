import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

// import { Table } from "@chakra-ui/react";
//import { Table } from "@chakra-ui/react";

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
];

const containerStyle = {
  width: "400px",
  height: "300px",
};

const singaporeCenter = {
  lat: 1.3475903679817594,
  lng: 103.96343497686826,
};

const locations = [
  {
    location_name: "SUTD",
    brief_description:
      "A leading institution focusing on design and technology education.",
    lat: 1.3425319567590408,
    lng: 103.96331928671684,
  },
  {
    location_name: "Sports Complex",
    brief_description:
      "A hub for sports activities with modern facilities for students and the public.",
    lat: 1.3448254399777448,
    lng: 103.96476065764611,
  },
  {
    location_name: "Singapore Expo",
    brief_description:
      "One of Singapore’s largest exhibition centers hosting trade shows and events.",
    lat: 1.3347550033983124,
    lng: 103.96273838918142,
  },
  {
    location_name: "Changi City Point",
    brief_description:
      "A popular retail mall near Changi Business Park, featuring outlet stores and a rooftop garden.",
    lat: 1.3346383636613013,
    lng: 103.96305923552042,
  },
  {
    location_name: "Changi Depot",
    brief_description:
      "An operational train depot supporting the maintenance and storage of MRT trains.",
    lat: 1.329381979318067,
    lng: 103.96086238454238,
  },
];

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
  });

  const navigate = useNavigate();
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(singaporeCenter);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={singaporeCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {locations.map((item) => (
          <Marker key={item.location_name} position={item} />
        ))}
        <></>
      </GoogleMap>

      <TableContainer>
        <Table variant="striped" colorScheme="green">
          <TableCaption>List of Collection Points</TableCaption>
          <Thead>
            <Tr>
              <Th>Location Name</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>

          <Tbody>
            {locations.map((item) => (
              <Tr
                key={item.location_name}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => navigate("/dropzone")}
              >
                <Td>{item.location_name}</Td>
                <Td>{item.brief_description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* <div>Hello World</div> */}
    </>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
