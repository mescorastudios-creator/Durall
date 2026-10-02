import type { ReactNode } from "react";

/* The section through the sill of a flush sliding door, as drawn in the
 * design (1920 × 1060), cut into the parts that arrive separately in
 * InTheDetail: the door leaf (glass, frame and roller), which comes down from
 * above; the sill, floors and ground it lands on, which come in from the
 * right; and the dimension marks and the drainage arrow, which fade in once
 * the two have met. The two faint grid lines stay put. Each part is its own
 * layer over the same box, so together, at rest, they are the drawing exactly
 * as it was when it was a single image.
 *
 * Generated from the design's export; the path data is not hand-edited. */

function Layer({ part, children }: { part: string; children: ReactNode }) {
  return (
    <svg
      data-sill={part}
      viewBox="0 0 1920 1060"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      {children}
    </svg>
  );
}

export function SillDrawing({ label, className }: { label: string; className: string }) {
  return (
    <div role="img" aria-label={label} className={className}>
      <Layer part="base">
        <path d="M1046 -233V1067M1488 -233V1067" stroke="#050834" strokeOpacity="0.06" />
        <path d="M383 144H1956M383 573H1956" stroke="#050834" strokeOpacity="0.08" />
      </Layer>
      <Layer part="lower">
        <path d="M1113.6 775.8V869.4" stroke="#050834" strokeOpacity="0.55" />
        <path
          d="M1488 787.5L1499.7 775.8M1488 799.2L1511.4 775.8M1488 810.9L1523.1 775.8M1488 822.6L1534.8 775.8M1488 834.3L1546.5 775.8M1488 846L1558.2 775.8M1488 857.7L1569.9 775.8M1488 869.4L1581.6 775.8M1488 881.1L1593.3 775.8M1495.8 885L1605 775.8M1507.5 885L1616.7 775.8M1519.2 885L1628.4 775.8M1530.9 885L1640.1 775.8M1542.6 885L1651.8 775.8M1554.3 885L1663.5 775.8M1566 885L1675.2 775.8M1577.7 885L1686.9 775.8M1589.4 885L1698.6 775.8M1601.1 885L1710.3 775.8M1612.8 885L1722 775.8M1624.5 885L1733.7 775.8M1636.2 885L1745.4 775.8M1647.9 885L1757.1 775.8M1659.6 885L1768.8 775.8M1671.3 885L1780.5 775.8M1683 885L1792.2 775.8M1694.7 885L1803.9 775.8M1706.4 885L1815.6 775.8M1718.1 885L1827.3 775.8M1729.8 885L1839 775.8M1741.5 885L1850.7 775.8M1753.2 885L1862.4 775.8M1764.9 885L1874.1 775.8M1776.6 885L1885.8 775.8M1788.3 885L1897.5 775.8M1800 885L1909.2 775.8M1811.7 885L1920.9 775.8M1823.4 885L1932.6 775.8M1835.1 885L1944.3 775.8M1846.8 885L1956 775.8M1858.5 885L1956 787.5M1870.2 885L1956 799.2M1881.9 885L1956 810.9M1893.6 885L1956 822.6M1905.3 885L1956 834.3M1917 885L1956 846M1928.7 885L1956 857.7M1940.4 885L1956 869.4M1952.1 885L1956 881.1"
          stroke="#050834"
          strokeOpacity="0.2"
          strokeWidth="0.8"
        />
        <path d="M383 885H1956" stroke="#050834" strokeOpacity="0.3" />
        <path
          d="M383 900.6L398.6 885M383 916.2L414.2 885M383 931.8L429.8 885M383 947.4L445.4 885M383 963L461 885M383 978.6L476.6 885M383 994.2L492.2 885M383 1009.8L507.8 885M383 1025.4L523.4 885M396 1028L539 885M411.6 1028L554.6 885M427.2 1028L570.2 885M442.8 1028L585.8 885M458.4 1028L601.4 885M474 1028L617 885M489.6 1028L632.6 885M505.2 1028L648.2 885M520.8 1028L663.8 885M536.4 1028L679.4 885M552 1028L695 885M567.6 1028L710.6 885M583.2 1028L726.2 885M598.8 1028L741.8 885M614.4 1028L757.4 885M630 1028L773 885M645.6 1028L788.6 885M661.2 1028L804.2 885M676.8 1028L819.8 885M692.4 1028L835.4 885M708 1028L851 885M723.6 1028L866.6 885M739.2 1028L882.2 885M754.8 1028L897.8 885M770.4 1028L913.4 885M786 1028L929 885M801.6 1028L944.6 885M817.2 1028L960.2 885M832.8 1028L975.8 885M848.4 1028L991.4 885M864 1028L1007 885M879.6 1028L1022.6 885M895.2 1028L1038.2 885M910.8 1028L1053.8 885M926.4 1028L1069.4 885M942 1028L1085 885M957.6 1028L1100.6 885M973.2 1028L1116.2 885M988.8 1028L1131.8 885M1004.4 1028L1147.4 885M1020 1028L1163 885M1035.6 1028L1178.6 885M1051.2 1028L1194.2 885M1066.8 1028L1209.8 885M1082.4 1028L1225.4 885M1098 1028L1241 885M1113.6 1028L1256.6 885M1129.2 1028L1272.2 885M1144.8 1028L1287.8 885M1160.4 1028L1303.4 885M1176 1028L1319 885M1191.6 1028L1334.6 885M1207.2 1028L1350.2 885M1222.8 1028L1365.8 885M1238.4 1028L1381.4 885M1254 1028L1397 885M1269.6 1028L1412.6 885M1285.2 1028L1428.2 885M1300.8 1028L1443.8 885M1316.4 1028L1459.4 885M1332 1028L1475 885M1347.6 1028L1490.6 885M1363.2 1028L1506.2 885M1378.8 1028L1521.8 885M1394.4 1028L1537.4 885M1410 1028L1553 885M1425.6 1028L1568.6 885M1441.2 1028L1584.2 885M1456.8 1028L1599.8 885M1472.4 1028L1615.4 885M1488 1028L1631 885M1503.6 1028L1646.6 885M1519.2 1028L1662.2 885M1534.8 1028L1677.8 885M1550.4 1028L1693.4 885M1566 1028L1709 885M1581.6 1028L1724.6 885M1597.2 1028L1740.2 885M1612.8 1028L1755.8 885M1628.4 1028L1771.4 885M1644 1028L1787 885M1659.6 1028L1802.6 885M1675.2 1028L1818.2 885M1690.8 1028L1833.8 885M1706.4 1028L1849.4 885M1722 1028L1865 885M1737.6 1028L1880.6 885M1753.2 1028L1896.2 885M1768.8 1028L1911.8 885M1784.4 1028L1927.4 885M1800 1028L1943 885M1815.6 1028L1956 887.6M1831.2 1028L1956 903.2M1846.8 1028L1956 918.8M1862.4 1028L1956 934.4M1878 1028L1956 950M1893.6 1028L1956 965.6M1909.2 1028L1956 981.2M1924.8 1028L1956 996.8M1940.4 1028L1956 1012.4"
          stroke="#050834"
          strokeOpacity="0.12"
          strokeWidth="0.8"
        />
        <path
          d="M1956 760.2H1488V775.8H1956V760.2Z"
          fill="#050834"
          fillOpacity="0.06"
          stroke="#050834"
          strokeOpacity="0.85"
          strokeWidth="1.3"
        />
        <path
          d="M903 859H383V874.6H903V859Z"
          fill="#050834"
          fillOpacity="0.05"
          stroke="#050834"
          strokeOpacity="0.7"
          strokeWidth="1.3"
        />
        <path
          d="M903 838.2L1046 760.2H1181.2V885H1046V859H903V838.2Z"
          stroke="#050834"
          strokeOpacity="0.95"
          strokeWidth="1.5"
        />
        <path
          d="M1165.6 775.8H1061.6V869.4H1165.6V775.8Z"
          stroke="#050834"
          strokeOpacity="0.55"
          strokeWidth="1.3"
        />
        <path
          d="M1488 760.2H1212.4V885H1488V760.2Z"
          stroke="#050834"
          strokeOpacity="0.95"
          strokeWidth="1.5"
        />
        <path
          d="M1332 775.8H1228V869.4H1332V775.8Z"
          stroke="#050834"
          strokeOpacity="0.55"
          strokeWidth="1.3"
        />
        <path
          d="M1472.4 775.8H1347.6V869.4H1472.4V775.8Z"
          stroke="#050834"
          strokeOpacity="0.55"
          strokeWidth="1.3"
        />
        <path
          d="M1212.4 775.8H1181.2V796.6H1212.4V775.8Z"
          fill="#050834"
          fillOpacity="0.92"
          stroke="#050834"
          strokeWidth="1.3"
        />
        <path
          d="M1212.4 848.6H1181.2V869.4H1212.4V848.6Z"
          fill="#050834"
          fillOpacity="0.92"
          stroke="#050834"
          strokeWidth="1.3"
        />
        <path
          d="M1087.6 760.2H1066.8V775.8H1087.6V760.2Z"
          stroke="#050834"
          strokeOpacity="0.9"
          strokeWidth="1.3"
        />
      </Layer>
      <Layer part="upper">
        <path
          d="M1155.2 -160.2L1165.6 -181M1228 -160.2L1238.4 -181M1155.2 -82.2L1165.6 -103M1228 -82.2L1238.4 -103M1155.2 -4.2L1165.6 -25M1228 -4.2L1238.4 -25M1155.2 73.8L1165.6 53M1228 73.8L1238.4 53M1155.2 151.8L1165.6 131M1228 151.8L1238.4 131M1155.2 229.8L1165.6 209M1228 229.8L1238.4 209M1155.2 307.8L1165.6 287M1228 307.8L1238.4 287M1155.2 385.8L1165.6 365M1228 385.8L1238.4 365M1155.2 463.8L1165.6 443M1228 463.8L1238.4 443"
          stroke="#050834"
          strokeOpacity="0.3"
        />
        <path
          d="M1134.4 731.6H1124V760.2H1134.4V731.6Z"
          fill="#050834"
          fillOpacity="0.3"
          stroke="#050834"
          strokeOpacity="0.9"
          strokeWidth="1.3"
        />
        <path
          d="M1129.2 731.6C1143.56 731.6 1155.2 719.959 1155.2 705.6C1155.2 691.24 1143.56 679.6 1129.2 679.6C1114.84 679.6 1103.2 691.24 1103.2 705.6C1103.2 719.959 1114.84 731.6 1129.2 731.6Z"
          fill="#FDFDFB"
          stroke="#050834"
          strokeOpacity="0.95"
          strokeWidth="1.3"
        />
        <path
          d="M1129.2 713.4C1133.51 713.4 1137 709.908 1137 705.6C1137 701.292 1133.51 697.8 1129.2 697.8C1124.89 697.8 1121.4 701.292 1121.4 705.6C1121.4 709.908 1124.89 713.4 1129.2 713.4Z"
          fill="#050834"
          fillOpacity="0.7"
        />
        <path
          d="M1105.8 417H1150V573H1181.2V677H1105.8V417Z"
          stroke="#050834"
          strokeOpacity="0.95"
          strokeWidth="1.5"
        />
        <path
          d="M1139.6 443H1118.8V560H1139.6V443Z"
          stroke="#050834"
          strokeOpacity="0.5"
          strokeWidth="1.3"
        />
        <path
          d="M1168.2 599H1118.8V661.4H1168.2V599Z"
          stroke="#050834"
          strokeOpacity="0.5"
          strokeWidth="1.3"
        />
        <path
          d="M1243.6 417H1287.8V677H1212.4V573H1243.6V417Z"
          stroke="#050834"
          strokeOpacity="0.95"
          strokeWidth="1.5"
        />
        <path
          d="M1277.4 443H1256.6V560H1277.4V443Z"
          stroke="#050834"
          strokeOpacity="0.5"
          strokeWidth="1.3"
        />
        <path
          d="M1274.8 599H1225.4V661.4H1274.8V599Z"
          stroke="#050834"
          strokeOpacity="0.5"
          strokeWidth="1.3"
        />
        <path
          d="M1212.4 586H1181.2V606.8H1212.4V586Z"
          fill="#050834"
          fillOpacity="0.92"
          stroke="#050834"
          strokeWidth="1.3"
        />
        <path
          d="M1212.4 643.2H1181.2V664H1212.4V643.2Z"
          fill="#050834"
          fillOpacity="0.92"
          stroke="#050834"
          strokeWidth="1.3"
        />
        <path
          d="M1170.8 -233H1150V573H1170.8V-233Z"
          fill="#C9D4DA"
          fillOpacity="0.55"
          stroke="#050834"
          strokeOpacity="0.9"
          strokeWidth="1.3"
        />
        <path
          d="M1243.6 -233H1222.8V573H1243.6V-233Z"
          fill="#C9D4DA"
          fillOpacity="0.55"
          stroke="#050834"
          strokeOpacity="0.9"
          strokeWidth="1.3"
        />
        <path
          d="M1222.8 -233H1170.8V534H1222.8V-233Z"
          fill="#E3E9EC"
          fillOpacity="0.18"
          stroke="#050834"
          strokeOpacity="0.25"
          strokeWidth="0.8"
        />
        <path
          d="M1222.8 534H1170.8V562.6H1222.8V534Z"
          fill="#050834"
          fillOpacity="0.2"
          stroke="#050834"
          strokeOpacity="0.8"
          strokeWidth="1.3"
        />
        <path
          d="M1145 401.4H1143.3C1140.54 401.4 1138.3 403.639 1138.3 406.4V425C1138.3 427.762 1140.54 430 1143.3 430H1145C1147.76 430 1150 427.762 1150 425V406.4C1150 403.639 1147.76 401.4 1145 401.4Z"
          fill="#050834"
          fillOpacity="0.9"
        />
        <path
          d="M1250.3 401.4H1248.6C1245.84 401.4 1243.6 403.639 1243.6 406.4V425C1243.6 427.762 1245.84 430 1248.6 430H1250.3C1253.06 430 1255.3 427.762 1255.3 425V406.4C1255.3 403.639 1253.06 401.4 1250.3 401.4Z"
          fill="#050834"
          fillOpacity="0.9"
        />
      </Layer>
      <Layer part="notes">
        <path d="M864 807V911M851 760.2H877M851 859H877" stroke="#050834" strokeOpacity="0.5" />
        <path
          d="M1077.2 739.4V812.2L923.801 846"
          stroke="#050834"
          strokeOpacity="0.8"
          strokeWidth="1.2"
          strokeDasharray="5 4"
        />
        <path
          d="M923.801 846L939.401 835.6L940.701 851.2L923.801 846Z"
          fill="#050834"
          stroke="#050834"
          strokeWidth="1.3"
        />
      </Layer>
    </div>
  );
}
