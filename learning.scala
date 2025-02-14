import scala.io.StdIn.readLine

def addInt(a: Int, b: Int): Int = {
  var sum: Int = 0
  sum = a + b
  return sum
}

println("Please enter your name:")
val name = "Hellos" //readLine()
println("Hello, " + name + "!")

println("Returned Value : " + addInt(5, 7));

val number = 5

if (number > 0) {
  println(s"$number is positive")

  if (number % 2 == 0) {
    println(s"$number is even")
  } else {
    println(s"$number is odd")
  }
} else if (number < 0) {
    println(s"$number is negative")
} else {
    println(s"$number is zero")
}
