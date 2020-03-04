const yulp = require('./index');
const source = yulp.compile(`
  object "SimpleStore" {
    code {
      datacopy(0, dataoffset("Runtime"), datasize("Runtime"))
      return(0, datasize("Runtime"))
    }
    object "Runtime" {
      code {
        calldatacopy(0, 0, 36) // write calldata to memory

        mstruct Calldata(
          sig: 4,
          val: 32
        )

        switch Calldata.sig(0) // select signature from memory

        case sig"function store(uint256 val)" { // new signature method
          sstore(0, Calldata.val(0)) // sstore calldata value
        }

        case sig"function get() returns (uint256)" {
          mstore(100, sload(0))
          return (100, 32)
        }
      }
    }
  }
  `);

console.log(yulp.print(source.results));
